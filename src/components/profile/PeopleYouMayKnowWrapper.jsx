import { getNearbyPeople } from "@/actions/friendActions"
import PeopleYouMayKnow from "./PeopleYouMayKnow"

export default async function PeopleYouMayKnowWrapper() {

    const response = await getNearbyPeople();
    const knownUsers = response?.success ? response.data : [];

    if (knownUsers.length === 0) return null;

    return (
        <PeopleYouMayKnow
            knowUsers={knownUsers}
        />
    )
}