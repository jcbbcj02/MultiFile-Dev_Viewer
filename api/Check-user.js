export default function handler(req,res){
const {email} = req.query;
if(!email) return res.status(400).json({error:"Missing email"});
if(email==="pro@test.com") return res.status(200).json({plan:"pro"});
return res.status(200).json({plan:"free"});
}
