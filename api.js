const auth_url = 'http://localhost:3000/api';
const chat_url = 'http://localhost:3002/chat';
const file_url = 'http://localhost:3001';
export default function (url= auth_url, rest_url, options) {
 const fullUrl = 'chat'=== url ? chat_url : url === 'file' ? file_url : auth_url ;
 return fetch(`${fullUrl}${rest_url}`, {
     headers: {
         authorization: `Bearer ${localStorage.getItem("token")}`,
         'Content-Type': 'application/json'
     },
     credentials: "include",
    ...options
 });
};