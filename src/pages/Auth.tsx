
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { User } from "@/types";
import { loginUser, registerUser } from "@/utils/auth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  university: z.string().optional(),
});

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("login");
  
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      university: "",
    },
  });

  const handleLogin = (values: z.infer<typeof loginSchema>) => {
    const result = loginUser(values.email, values.password);
    
    if (result.success) {
      toast.success("Login successful!");
      navigate("/dashboard");
    } else {
      toast.error(result.message || "Login failed. Please try again.");
    }
  };

  const handleSignup = (values: z.infer<typeof signupSchema>) => {
    const result = registerUser({
      id: crypto.randomUUID(),
      name: values.name,
      email: values.email,
      university: values.university,
      overallProgress: 0,
      photoUrl: undefined,
    }, values.password);
    
    if (result.success) {
      toast.success("Account created successfully!");
      setActiveTab("login");
    } else {
      toast.error(result.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-b from-primary/5 to-background">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">InspireMe</CardTitle>
          <CardDescription className="text-center">Your journey to self-improvement starts here</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your email" 
                            type="email" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your password" 
                            type="password" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full">Login</Button>
                </form>
              </Form>
              
              <div className="mt-4 text-center text-sm text-muted-foreground">
                <span>Don't have an account? </span>
                <button 
                  onClick={() => setActiveTab("signup")} 
                  className="text-primary hover:underline"
                >
                  Sign up
                </button>
              </div>
            </TabsContent>
            
            <TabsContent value="signup">
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                  <FormField
                    control={signupForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your name" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your email" 
                            type="email" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your password" 
                            type="password" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signupForm.control}
                    name="university"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>University (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your university" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full">Sign up</Button>
                </form>
              </Form>
              
              <div className="mt-4 text-center text-sm text-muted-foreground">
                <span>Already have an account? </span>
                <button 
                  onClick={() => setActiveTab("login")} 
                  className="text-primary hover:underline"
                >
                  Login
                </button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
