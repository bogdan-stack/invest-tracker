import { type NextPage } from "next";
import Head from "next/head";
import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { Stack, Card, CardHeader, CardBody, Text, StackDivider, Heading, HStack} from "@chakra-ui/react";


import { api } from "~/utils/api";

const Home: NextPage = () => {

  const user = useUser();
  if (!user) return null;

  const {data} = api.example.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center h-screen">
        <div className=" h-full w-full bg-slate-100 border-x">
        <div className=" flex justify-between w-full gap-4 bg-white border-x p-3 shadow-sm align-middle">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
          {!user.isSignedIn && <SignInButton><button className=" bg-red-600 text-white font-medium rounded-md p-2">Log In</button></SignInButton>}
          {!!user.isSignedIn && <Text padding={3} textColor='black' fontWeight='bold'>Hello Bogdan!</Text>}
          {!!user.isSignedIn && <SignOutButton><button className=" bg-red-600 text-white font-medium rounded-md p-2">Log Out</button></SignOutButton>}
        </div>
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
        <Stack justifyContent='center' p={5}>
        <Card w='90%' alignSelf='center' backgroundColor='white'>
          <CardHeader>
          <Heading fontSize='md'>Investments</Heading>
          </CardHeader>
          <CardBody>
          <Stack divider={<StackDivider />} spacing='3'>
          {data?.map((post) => (
          <HStack justifyContent='space-between' textAlign='center' key={post.id}>
            <Text textColor='black' fontWeight='medium' > {post.investAmount} RON</Text>
            <Text textColor='gray.500' > {post.fondName} </Text>
            <Text textColor='gray.500'> {post.createdAt.toDateString()} </Text>
          </HStack>))}
          </Stack>
          </CardBody>
          </Card>
          </Stack>
        </div>

      </main>
    </>
  );
};

export default Home;
