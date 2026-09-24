"use client";
import { useState } from "react";
export default function SignupPage(){
  const [form,setForm]=useState({companyName:"",fullName:"",email:"",password:""});
  const [msg,setMsg]=useState("");
  async function submit(e:React.FormEvent){e.preventDefault();const r=await fetch("/api/signup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});const j=await r.json();setMsg(j.message||j.error);}
  return <div style={{maxWidth:400,margin:"40px auto"}}><h1>Signup</h1><form onSubmit={submit} style={{display:"flex",flexDirection:"column",gap:8}}><input placeholder="Company" value={form.companyName} onChange={e=>setForm({...form,companyName:e.target.value})} required/><input placeholder="Full Name" value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})} required/><input placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/><input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/><button type="submit">Sign up</button></form>{msg&&<p>{msg}</p>}</div>;
}
