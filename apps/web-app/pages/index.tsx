// pages/index.tsx
import { GetServerSideProps } from "next"
import axios from "axios"
import { EventsDTO } from "../types"
import HomeTemplate from "../templates/Home"

type Props = {
    events: EventsDTO[]
}

const Home = ({ events }: Props) => <HomeTemplate events={events} />

export default Home

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    try {
        const url = process.env.URL_TO_FETCH

        const eventsResponse = await axios.post(
            `${url}/api/fetchEvents`,
            {},
            {
                headers: {
                    "x-api-key": process.env.KEY_TO_API as string // Pass cookies from the incoming request
                }
            }
        )
        const events = await eventsResponse.data
        return {
            props: { events }
        }
    } catch (error) {
        res.statusCode = 404
        return {
            props: {}
        }
    }
}
