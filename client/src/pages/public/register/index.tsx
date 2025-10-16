import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { authAPI } from "@/lib/api";
import { useUserStore } from '@/store/userStore';


const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  name: z.string().min(1, "Name is required"),
  role: z.enum(["user", "owner"]),
});

function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const { setUser } = useUserStore();


  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "", 
      role: "user", // Default role can be set to 'user' or 'owner'
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      
      // Call the register API with the form values
      const response = await authAPI.register({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role  
      });
      
      console.log('Registration successful:', response);
      toast.success('Registration successful! Welcome!');
      
      // Set user data in Zustand store
      setUser({
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
      });
      
      // Clear the form
      form.reset();
      
      // Redirect to appropriate dashboard based on role
      if (response.data.role === 'owner') {
        navigate('/owner-dashboard');
      } else {
        navigate('/user-dashboard');
      }
      
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-primary">
      <Toaster position="top-right" />
      <div className="bg-white rounded p-5 flex flex-col border w-[500px]">
        <h1 className="text-primary text-xl font-bold uppercase">
          Register an account
        </h1>
        <hr className="border-gray-300" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row gap-7 "
                    >
                      {["user", "owner"].map((role) => (
                        <FormItem
                          key={role}
                          className="flex items-center gap-3"
                        >
                          <FormControl>
                            <RadioGroupItem value={role} />
                          </FormControl>
                          <FormLabel className="font-normail uppercase font-semibold">
                            {role}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between items-center">
              <h1 className="flex gap-5 text-sm text-primary items-center font-semibold">
                Already have an account?{" "}
                <Link to="/login" className="text-primary underline font-semibold">
                  LogIn
                </Link>
              </h1>
              <Button type="submit" disabled={loading}>
                {loading ? "Registering..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default RegisterPage;
