import{r as i,c as u,a as t,w as x,b as c,v as g,d as w,t as d,e as y,f as p,g as h,h as k,i as _,o as m,u as N}from"./index-CA71TOlh.js";const E={class:"min-h-screen w-full flex flex-col justify-center items-center bg-gray-900 px-4 py-6"},S={class:"bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-8"},V={class:"space-y-2"},C={class:"space-y-2"},D={class:"relative"},T=["type"],j={key:0,class:"bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-2 rounded-lg text-sm"},q=["disabled"],B={class:"mt-6 text-center"},I={class:"text-gray-400 text-sm"},R={__name:"login",setup(M){const v=N(),o=i({nickName:"",password:""}),r=i(!1),a=i(""),n=i(!1),b=async()=>{if(!o.value.nickName||!o.value.password){a.value="Todos los campos son requeridos";return}n.value=!0,a.value="";try{const s=await fetch("http://localhost:5011/users/login",{method:"POST",headers:{"Content-Type":"application/json","x-version":"1.0.0"},body:JSON.stringify(o.value)}),e=await s.json();if(console.log("Datos de respuesta:",e),s.ok&&e.token)localStorage.setItem("token",e.token),console.log("Redirigiendo a /notes"),await v.push({name:"notes"});else throw new Error(e.message||"Error en la autenticación")}catch(s){console.error("Error:",s),a.value=s.message.includes("Failed to fetch")?"Error de conexión: No se pudo contactar con el servidor":`Error: ${s.message}`}finally{n.value=!1}};return(s,e)=>{const f=_("router-link");return m(),u("div",E,[t("div",S,[e[7]||(e[7]=t("h1",{class:"font-bold mb-6 text-3xl text-center text-white"},"Notes",-1)),t("form",{onSubmit:x(b,["prevent"]),class:"space-y-6"},[t("div",V,[e[3]||(e[3]=t("label",{for:"nickName",class:"font-bold text-white block text-sm"},"Nickname",-1)),c(t("input",{class:"w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-500",type:"text",id:"nickName","onUpdate:modelValue":e[0]||(e[0]=l=>o.value.nickName=l),placeholder:"Your nickname",required:""},null,512),[[g,o.value.nickName]])]),t("div",C,[e[4]||(e[4]=t("label",{for:"password",class:"font-bold text-white block text-sm"},"Password",-1)),t("div",D,[c(t("input",{class:"w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-pink-500",type:r.value?"text":"password",id:"password","onUpdate:modelValue":e[1]||(e[1]=l=>o.value.password=l),placeholder:"Your password",required:""},null,8,T),[[w,o.value.password]]),t("button",{type:"button",onClick:e[2]||(e[2]=l=>r.value=!r.value),class:"absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"},d(r.value?"🙈":"👁️"),1)])]),a.value?(m(),u("div",j,d(a.value),1)):y("",!0),t("button",{type:"submit",disabled:n.value,class:"w-full bg-pink-600 text-white font-semibold py-2 rounded-lg hover:bg-pink-700 disabled:opacity-50"},d(n.value?"Iniciando sesión...":"Iniciar sesión"),9,q)],32),t("div",B,[t("p",I,[e[6]||(e[6]=p(" ¿No tienes una cuenta? ")),h(f,{to:"/register",class:"text-pink-500 hover:underline font-semibold"},{default:k(()=>e[5]||(e[5]=[p(" Regístrate ")])),_:1})])])])])}}};export{R as default};
