import FireExtinguisherManagement from "../components/FireExtinguisherManagement";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

const Index = () => {
  return (
    <>
      <Toaster />
      <Sonner />
      <FireExtinguisherManagement />
    </>
  );
};

export default Index;
