import { redirect } from "next/navigation";
export default async function CommunityEditRedirect({ params }: { params: Promise<{id:string}> }) { const { id } = await params; redirect(`/community/${id}?mode=edit`); }
