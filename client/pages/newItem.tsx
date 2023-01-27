import {NextPage} from "next";
import Layout from "@/components/Layout";
import dynamic from 'next/dynamic'
const NewPoduct = dynamic(() => import("@/components/NewPoduct/NewPoduct"), {
  ssr: false,
})

const newItem: NextPage = () => {
  return (
    <Layout pageTitle="New Item">
      <NewPoduct />
    </Layout>
  )
}
export default newItem;