import { NextPage } from "next";
import Layout from "@/components/Layout";
import FaqAccordion from "@/components/Faq/FaqAccordion";

const FAQ: NextPage = () => {
  return (
    <Layout pageTitle="FAQ">
      <FaqAccordion />
    </Layout>
  );
};
export default FAQ;
