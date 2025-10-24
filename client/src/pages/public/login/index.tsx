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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios'; 
import { authAPI } from "@/lib/api";
import { useUserStore } from '@/store/userStore';

// Configure axios defaults
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
axios.defaults.baseURL = API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json'; 

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["user", "owner"]),
});

function LoginPage() {

  const [loading, setLoading] = useState(false);
  const { setUser } = useUserStore();

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "user", // Default role can be set to 'user' or 'owner'
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      
      // Call the login API with the form values
      const response = await authAPI.login({
        email: values.email,
        password: values.password,
        role: values.role
      });
      
      console.log('Login successful:', response);
      console.log('Response data:', response.data);
      console.log('User data:', response.data?.data);
      toast.success('Login successful!');

      // Manually trigger auth check and wait for it
      console.log('Manually triggering auth check...');
      
      // Wait a moment for the cookie to be set, then check auth status
      setTimeout(async () => {
        try {
          const authResponse = await fetch('http://localhost:3001/api/auth/me', {
            method: 'GET',
            credentials: 'include',
          });
          
          console.log('Manual auth check status:', authResponse.status);
          
          if (authResponse.ok) {
            const authData = await authResponse.json();
            console.log('Manual auth check response:', authData);
            
            // Set user data in Zustand store
            setUser({
              id: authData.userId,
              name: authData.name || '',
              email: authData.email,
              role: authData.role,
            });
            
            const userRole = authData.role;
            console.log('Confirmed user role:', userRole);
            
            if (userRole === 'owner') {
              console.log('Navigating to owner dashboard...');
              navigate('/owner-dashboard');
            } else {
              console.log('Navigating to user home page...');
              navigate('/home');
            }
          } else {
            console.error('Auth check failed after login');
            toast.error('Authentication failed. Please try logging in again.');
          }
        } catch (error) {
          console.error('Manual auth check error:', error);
          toast.error('Authentication error. Please try logging in again.');
        }
      }, 1000); // Wait 1 second for cookie to be properly set
      
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Login failed. Please try again.");
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
          Login to your account
        </h1>
        <hr className="border-gray-300" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                Don't have an account?{" "}
                <Link to="/register" className="text-primary underline font-semibold">
                  Register
                </Link>
              </h1>
              <Button type="submit" disabled={loading}>Submit</Button>
            </div>
          </form>
        </Form>

      </div>
    </div>
  );
}

export default LoginPage;
