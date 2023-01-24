import { NextPage } from "next";
import { Heading } from "@chakra-ui/react";
import Layout from "@/components/Layout";

const Dashboard: NextPage = () => {
  return (
    <Layout pageTitle="Dashboard">
      <Heading>Dashboard</Heading>
    </Layout>
  );
};
export default Dashboard;
