export default async function handler(req,res){
const event = req.body;
if(event.type==="checkout.session.completed"){
const email = event.data.object.customer_email;
console.log(`Upgrade user: ${email} → Pro`);
// TODO: update database to mark Pro
}
res.status(200).end();
}
