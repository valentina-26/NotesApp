import{r as l,c as f,a as t,w as g,b as n,v as c,d as k,t as p,j as w,e as h,f as N,o as y,u as V}from"./index-CA71TOlh.js";const A={class:"min-h-screen w-full flex flex-col justify-center items-center bg-gray-900 px-4 py-6"},C={class:"w-full max-w-md bg-gray-800 rounded-lg shadow-xl p-8"},j={class:"relative mt-1"},S=["type"],T={class:"flex items-center"},M={key:0,class:"text-red-500 text-sm mt-2"},P=["disabled"],U={class:"mt-6 text-center"},q={class:"text-sm text-gray-400"},B={__name:"create",setup(D){const m=V(),o=l({name:"",nickName:"",email:"",password:""}),d=l(!1),i=l(!1),r=l(""),u=l(!1),b=()=>{i.value=!i.value},x=async()=>{if(!d.value){r.value="Please accept the terms and privacy policy.";return}try{u.value=!0,r.value="";const a=await fetch("http://localhost:5011/users",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json","x-version":"1.0.0"},body:JSON.stringify(o.value),credentials:"include"}),e=await a.json();a.status===201?(e.token&&localStorage.setItem("authToken",e.token),m.push("/notes")):r.value=e.message||"An error occurred while creating the account."}catch(a){console.error("Error:",a),r.value="An unexpected error occurred. Please try again."}finally{u.value=!1}},v=()=>{m.push("/login")};return(a,e)=>(y(),f("div",A,[t("div",C,[e[11]||(e[11]=t("h1",{class:"text-3xl font-bold text-center text-white mb-6"},"Create Account",-1)),t("form",{onSubmit:g(x,["prevent"]),class:"space-y-4"},[t("div",null,[e[5]||(e[5]=t("label",{for:"name",class:"block text-sm font-medium text-gray-300"},"Name",-1)),n(t("input",{type:"text",id:"name","onUpdate:modelValue":e[0]||(e[0]=s=>o.value.name=s),required:"",class:"mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent",placeholder:"Your name"},null,512),[[c,o.value.name]])]),t("div",null,[e[6]||(e[6]=t("label",{for:"nickName",class:"block text-sm font-medium text-gray-300"},"Nickname",-1)),n(t("input",{type:"text",id:"nickName","onUpdate:modelValue":e[1]||(e[1]=s=>o.value.nickName=s),required:"",class:"mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent",placeholder:"Your nickname"},null,512),[[c,o.value.nickName]])]),t("div",null,[e[7]||(e[7]=t("label",{for:"email",class:"block text-sm font-medium text-gray-300"},"Email",-1)),n(t("input",{type:"email",id:"email","onUpdate:modelValue":e[2]||(e[2]=s=>o.value.email=s),required:"",class:"mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent",placeholder:"Your email"},null,512),[[c,o.value.email]])]),t("div",null,[e[8]||(e[8]=t("label",{for:"password",class:"block text-sm font-medium text-gray-300"},"Password",-1)),t("div",j,[n(t("input",{type:i.value?"text":"password",id:"password","onUpdate:modelValue":e[3]||(e[3]=s=>o.value.password=s),required:"",class:"block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent",placeholder:"Your password"},null,8,S),[[k,o.value.password]]),t("button",{type:"button",onClick:b,class:"absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"},p(i.value?"🙈":"👁️"),1)])]),t("div",T,[n(t("input",{id:"terms",type:"checkbox","onUpdate:modelValue":e[4]||(e[4]=s=>d.value=s),class:"h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"},null,512),[[w,d.value]]),e[9]||(e[9]=t("label",{for:"terms",class:"ml-2 block text-sm text-gray-300"}," I accept the terms and privacy policy ",-1))]),r.value?(y(),f("div",M,p(r.value),1)):h("",!0),t("button",{type:"submit",disabled:u.value,class:"w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"},p(u.value?"Creating Account...":"Create Account"),9,P)],32),t("div",U,[t("p",q,[e[10]||(e[10]=N(" Already have an account? ")),t("a",{onClick:g(v,["prevent"]),href:"#",class:"font-medium text-pink-500 hover:text-pink-400"}," Sign in ")])])])]))}};export{B as default};
