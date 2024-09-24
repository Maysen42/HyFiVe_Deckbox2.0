import TabBar from "../src/frontend/tabBar";
import TabContent from "../src/frontend/tabContent";
import { useStore } from "../src/stores";
import { GetServerSideProps } from "next";
import { useEffect } from "react";

interface Props {
  access: string | null;
}

export default function Home({ access }: Props) {
  const { data: dataStore } = useStore();
  useEffect(() => {
    dataStore.setAccess(access);
  }, []);
  return (
    <div className="flex items-center w-full flex-col h-screen">
      <TabBar />
      <div className="bg-white w-full h-auto shadow max-w-5xl p-5 flex-1">
        <TabContent />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
  const access = String(req.headers.access);
  return {
    props: {
      access: access || null,
    },
  };
};
