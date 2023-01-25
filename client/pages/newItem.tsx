import {NextPage} from "next";
import Layout from "@/components/Layout";
import NewPoduct from "@/components/NewPoduct/NewPoduct";

const newItem: NextPage = () => {
  return (
    <Layout pageTitle="New Item">
      <NewPoduct />
    </Layout>
  )
}
export default newItem;