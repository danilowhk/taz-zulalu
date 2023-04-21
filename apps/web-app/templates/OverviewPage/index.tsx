import BaseTemplate from "../Base"
import { SessionsDTO } from "../../types"
import { useUserAuthenticationContext } from "../../context/UserAuthenticationContext"

type Props = {
    sessions: SessionsDTO[]
}

const OverviewPage = ({ sessions }: Props) => {
    const { userInfo } = useUserAuthenticationContext()

    return (
        <BaseTemplate>
            {userInfo?.role == "organizer" ? (
                <div className="flex flex-col min-h-[100vh] bg-[#EEEEF0] p-5 gap-10">
                    <h1 className="font-normal text-[32px] md:text-[52px]">Organizers Overview</h1>
                    <div className="overflow-auto">
                        <table className="w-full p-5 text-[12px] table-fixed border-collapse border border-slate-400 p-8">
                            <thead>
                                <tr className="bg-slate-200">
                                    <th className="border border-slate-300 font-semibold tracking-wide p-3">ID</th>
                                    <th className="border border-slate-300 font-semibold tracking-wide p-3 w-[200px]">
                                        Name
                                    </th>
                                    <th className="border border-slate-300 font-semibold tracking-wide p-3">
                                        StartDate
                                    </th>
                                    <th className="border border-slate-300 font-semibold tracking-wide p-3">
                                        StartTime
                                    </th>
                                    <th className="border border-slate-300 font-semibold tracking-wide p-3">
                                        Duration
                                    </th>
                                    <th className="border border-slate-300 font-semibold tracking-wide p-3">
                                        Location
                                    </th>
                                    <th className="border border-slate-300 font-semibold tracking-widet p-3">
                                        Custom Location
                                    </th>
                                    <th className="border border-slate-300 font-semibold tracking-wide p-3 w-[200px]">
                                        Equipment
                                    </th>
                                    <th className="border border-slate-300 font-semibold tracking-wide p-3 w-[500px]">
                                        Description
                                    </th>
                                    <th className="border border-slate-300 font-semibold tracking-wide p-3">
                                        Event Type
                                    </th>
                                    <th className="border border-slate-300 font-semibold tracking-wide p-3">Format</th>
                                    <th className="border border-slate-300 font-semibold tracking-wide p-3">Track</th>
                                    <th className="border border-slate-300 font-semibold tracking-wide p-3">Level</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sessions.map((event) => {
                                    return (
                                        <tr className="font-light">
                                            <th className="border border-slate-300 font-normal tracking-wide p-3">
                                                {event.id}
                                            </th>
                                            <th className="border border-slate-300 font-normal tracking-wide p-3">
                                                {event.name}
                                            </th>
                                            <th className="border border-slate-300 font-normal tracking-wide p-3">
                                                {event.startDate.toString()}
                                            </th>
                                            <th className="border border-slate-300 font-normal tracking-wide p-3">
                                                {event.startTime}
                                            </th>
                                            <th className="border border-slate-300 font-normal tracking-wide p-3">
                                                {event.duration}
                                            </th>
                                            <th className="border border-slate-300 font-normal tracking-wide p-3">
                                                {event.location}
                                            </th>
                                            <th className="border border-slate-300 font-normal tracking-wide p-3">
                                                {event.custom_location}
                                            </th>
                                            <th className="border border-slate-300 font-normal tracking-wide p-3">
                                                {event.equipment}
                                            </th>
                                            <th className="border border-slate-300 font-normal tracking-wide p-3">
                                                {event.description}
                                            </th>
                                            <th className="border border-slate-300 font-normal tracking-wide p-3">
                                                {event.event_type}
                                            </th>
                                            <th className="border border-slate-300 font-normal tracking-wide p-3">
                                                {event.format}
                                            </th>
                                            <th className="border border-slate-300 font-normal tracking-wide p-3">
                                                {event.track}
                                            </th>
                                            <th className="border border-slate-300 font-normal tracking-wide p-3">
                                                {event.level}
                                            </th>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div>
                    <h2 className="text-lg my-10 text-center">This page is for organizers only</h2>
                </div>
            )}
        </BaseTemplate>
    )
}

export default OverviewPage
