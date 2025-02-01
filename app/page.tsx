'use server'

import QuizApp from "@/components/ui/pages/main";

export default async function Page() {
  const data=await fetch('https://api.jsonserve.com/Uw5CrX').then(res=>res.json());


    return <QuizApp data={data}/>
}
