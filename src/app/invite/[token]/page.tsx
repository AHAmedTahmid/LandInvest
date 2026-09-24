"use client";
import { useState } from "react";
export default function InvitePage({params}:{params:{token:string}}){
  const [password,setPassword]=useState("");
  const [fullName,setFullName]=useState("");
  const [msg,setMsg]=useState("");
  async function submit(e:React.FormEvent){
    e.preventDefault();
    const r=await fetch(`/api/invites/accept`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:params.token,password,fullName})});
    const j=await r.json(); setMsg(j.message||j.error);
  }
  return <div style={{maxWidth:400,margin:"40px auto"}}><h1>Accept Invite</h1><form onSubmit={submit} style={{display:"flex",flexDirection:"column",gap:8}}><input placeholder="Full Name" value={fullName} onChange={e=>setFullName(e.target.value)} required/><input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/><button>Accept</button></form>{msg&&<p>{msg}</p>}</div>;
}
