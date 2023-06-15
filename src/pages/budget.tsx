/* eslint-disable */
/* elint-disable */
import { Card, Text, Stack, Heading } from '@chakra-ui/react'
import React from 'react'
import Footer from '~/components/Footer'

const budget = () => {
  return (
    <>
    <Stack height="100vh" backgroundColor="#fafafa" display="flex" flexDirection="column">
      <Stack position="unset" justifyContent="center" p={3}>
        <Card
    height="full"
    position="unset">
          <Heading>Budget</Heading>
        </Card>
        <Card
    height="full"
    position="unset">
          <Heading>Budget</Heading>
        </Card>
        <Card
    height="full"
    position="unset">
          <Heading>Budget</Heading>
        </Card>
      </Stack>
    </Stack>
    <Footer/>
    </>
  )
}

export default budget