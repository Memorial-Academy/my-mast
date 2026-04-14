"use client";

import API from "@/app/lib/APIHandler";
import { LabelledInput, Popup } from "@mymast/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

type UpdateVirtualClassroomLinkProps = {
    program: string,
    uuid: string,
    session: string,
    currentLink?: string
}

export default function UpdateVirtualClassroomLink(props: UpdateVirtualClassroomLinkProps) {
    const [active, setActive] = useState(false);
    const router = useRouter();

    return (
        <>
            <button onClick={() => {setActive(true)}}>Update internal link</button>
            <Popup
                active={active}
                onClose={() => {setActive(false)}}
                persist={false}
            >
                <h2>Update virtual classroom link</h2>
                <form action={(data) => {
                    API.Admin.updateVirtualClassroomLink({
                        uuid: props.uuid,
                        token: props.session,
                        program_id: props.program,
                        newLink: data.get("link")?.toString() || ""
                    }).finally(() => {
                        setActive(false);
                        router.refresh();
                    })
                }}>
                    <LabelledInput question={"Link"} name={"link"} defaultValue={props.currentLink} required />
                    <input type="submit" value="Submit" />
                </form>
            </Popup>
        </>
    )
}