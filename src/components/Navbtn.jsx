import React from 'react'
import { Button, HStack, Text, AvatarBadge, Avatar } from '@chakra-ui/react'
import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

const Navbtn = () => {
  const message = api.example.hello.useQuery().data?.greeting;
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  return (
    <HStack
            backgroundColor="white"
            display="flex"
            position="sticky"
            top="0"
            justifyContent="space-between"
            padding="3"
            paddingBottom={1}
            paddingTop={1}
            shadow="md"
          >
            {!isSignedIn && (
              <>
                <Text>Please sign in!</Text>
                <SignInButton>
                  <Button
                    backgroundColor="#e9041e"
                    textColor="white"
                    fontSize="sm"
                    padding="1.5"
                    height="-webkit-fit-content"
                    alignSelf="center"
                  >
                    <ArrowLeftOnRectangleIcon
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                  </Button>
                </SignInButton>
              </>
            )}
            {!!isSignedIn && (
              <Avatar size="sm" bg="#e9041e">
                <AvatarBadge boxSize="1.25em" bg="green.500" />
              </Avatar>
            )}

            {!!isSignedIn && (
              <Text padding={2} textColor="black" fontWeight="bold">
                 {message}
              </Text>
            )}
            {!!isSignedIn && (
              <SignOutButton>
                <Button
                  backgroundColor="#e9041e"
                  textColor="white"
                  fontSize="sm"
                  padding="1.5"
                  height="-webkit-fit-content"
                  alignSelf="center"
                >
                  <ArrowRightOnRectangleIcon
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                </Button>
              </SignOutButton>
            )}
          </HStack>
  )
}

export default Navbtn