import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductListingForm from '@/components/dashboard/ProductListingForm';
import MyProducts from '@/components/dashboard/MyProducts';
import DashboardStats from '@/components/dashboard/DashboardStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  const { address, isConnected } = useAccount();
  
  if (!isConnected) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Farmer Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your products and track your sales onchain
          </p>
          <p className="text-sm text-primary mt-2">
            Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>

        <DashboardStats />

        <Tabs defaultValue="products" className="mt-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="products">My Products</TabsTrigger>
            <TabsTrigger value="new">List New Product</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="mt-6">
            <MyProducts />
          </TabsContent>
          
          <TabsContent value="new" className="mt-6">
            <ProductListingForm />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
