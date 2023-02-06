import { NextPage } from "next";
import Layout from "@/components/Layout";
import Livepeer from "@/components/Liveppear/Liveppear";

const LivepeerPage: NextPage = () => {
  return (
    <Layout pageTitle="Livepeer">
      <Livepeer />
    </Layout>
  );
};
export default LivepeerPage;
