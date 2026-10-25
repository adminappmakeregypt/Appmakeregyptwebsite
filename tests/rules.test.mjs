import { initializeTestEnvironment, assertSucceeds, assertFails } from "@firebase/rules-unit-testing";
import { readFileSync } from "fs";
import { doc, setDoc, getDoc, updateDoc, getDocs, collection, addDoc, serverTimestamp, Timestamp, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getBytes } from "firebase/storage";
const env = await initializeTestEnvironment({ projectId: "bookmydoctor-6c93c",
  firestore: { rules: readFileSync("firestore.rules","utf8"), host:"127.0.0.1", port:8085 },
  storage: { rules: readFileSync("storage.rules","utf8"), host:"127.0.0.1", port:9199 } });
let pass=0, fail=0;
async function t(name, p){ try{ await p; pass++; console.log("PASS", name);}catch(e){ fail++; console.log("FAIL", name, e.message.slice(0,200)); } }
const PAY="https://accept.paymob.com/api/acceptance/payment_links/abc";
await env.withSecurityRulesDisabled(async c=>{ const f=c.firestore();
  await setDoc(doc(f,"promotions","P1"),{title:"عرض",status:"published",paymentUrl:PAY,description:"d",buttonText:"x",displayOrder:1});
  await setDoc(doc(f,"promotions","P2"),{title:"draft",status:"draft",paymentUrl:PAY,description:"d",buttonText:"x",displayOrder:2});
});
const cAnon=env.unauthenticatedContext(), cAdm=env.authenticatedContext("adm",{email:"appmakeregypt@gmail.com"});
const anon = cAnon.firestore();
const admin = cAdm.firestore();
const other = env.authenticatedContext("u2",{email:"someone@x.com"}).firestore();
const base = (id, over={}) => ({ requestId:id, promotionId:"P1", promotionSnapshot:{title:"عرض",description:"d",priceText:"",durationMonths:12}, paymentUrl:PAY,
  doctor:{fullName:"د. أحمد",specialty:"dental",clinicName:"عيادة",mobile:"01012345678",email:"a@b.com"}, website:{bio:"x"}, setup:{doctorsCount:"2"},
  consent:true, lang:"ar", createdAt:serverTimestamp(), paymentStatus:"pending", formStatus:"submitted", reviewNotes:"", accountSetupStatus:"not_started",
  websiteSetupStatus:"not_started", subscriptionStart:null, subscriptionEnd:null, credentialsSent:false, ...over });
await t("public valid create", assertSucceeds(setDoc(doc(anon,"subscriptionRequests","R1"), base("R1"))));
await t("public cannot overwrite existing request", assertFails(setDoc(doc(anon,"subscriptionRequests","R1"), base("R1"))));
await t("public cannot set payment confirmed", assertFails(setDoc(doc(anon,"subscriptionRequests","R2"), base("R2",{paymentStatus:"confirmed"}))));
await t("public cannot set own dates", assertFails(setDoc(doc(anon,"subscriptionRequests","R3"), base("R3",{subscriptionStart:Timestamp.now()}))));
await t("public cannot set credentialsSent", assertFails(setDoc(doc(anon,"subscriptionRequests","R3"), base("R3",{credentialsSent:true}))));
await t("tampered paymentUrl rejected", assertFails(setDoc(doc(anon,"subscriptionRequests","R4"), base("R4",{paymentUrl:"https://evil.com"}))));
await t("draft promotion rejected", assertFails(setDoc(doc(anon,"subscriptionRequests","R5"), base("R5",{promotionId:"P2"}))));
await t("missing promotion rejected", assertFails(setDoc(doc(anon,"subscriptionRequests","R6"), base("R6",{promotionId:"NOPE"}))));
await t("missing doctor name rejected", assertFails(setDoc(doc(anon,"subscriptionRequests","R7"), base("R7",{doctor:{specialty:"dental",clinicName:"c",mobile:"0101",email:"a@b.com"}}))));
await t("bad specialty rejected", assertFails(setDoc(doc(anon,"subscriptionRequests","R8"), base("R8",{doctor:{fullName:"x",specialty:"hack",clinicName:"c",mobile:"0101",email:"a@b.com"}}))));
await t("bad email rejected", assertFails(setDoc(doc(anon,"subscriptionRequests","R8"), base("R8",{doctor:{fullName:"x",specialty:"dental",clinicName:"c",mobile:"0101",email:"nope"}}))));
await t("extra field rejected", assertFails(setDoc(doc(anon,"subscriptionRequests","R9"), base("R9",{password:"x"}))));
await t("no consent rejected", assertFails(setDoc(doc(anon,"subscriptionRequests","R9"), base("R9",{consent:false}))));
await t("foreign photo path rejected", assertFails(setDoc(doc(anon,"subscriptionRequests","R9"), base("R9",{website:{photoPath:"promotions/P1/photo.jpg"}}))));
await t("own photo path ok", assertSucceeds(setDoc(doc(anon,"subscriptionRequests","R10"), base("R10",{website:{photoPath:"subscriptionRequests/R10/photo.jpg"}}))));
await t("public cannot read a request", assertFails(getDoc(doc(anon,"subscriptionRequests","R1"))));
await t("public cannot list requests", assertFails(getDocs(collection(anon,"subscriptionRequests"))));
await t("other user cannot read", assertFails(getDoc(doc(other,"subscriptionRequests","R1"))));
await t("public cannot update", assertFails(updateDoc(doc(anon,"subscriptionRequests","R1"),{paymentStatus:"confirmed"})));
await t("other user cannot update", assertFails(updateDoc(doc(other,"subscriptionRequests","R1"),{paymentStatus:"confirmed"})));
await t("admin can list", assertSucceeds(getDocs(collection(admin,"subscriptionRequests"))));
await t("admin confirms payment", assertSucceeds(updateDoc(doc(admin,"subscriptionRequests","R1"),{paymentStatus:"confirmed",updatedAt:serverTimestamp(),updatedBy:"appmakeregypt@gmail.com"})));
await t("admin cannot alter customer data", assertFails(updateDoc(doc(admin,"subscriptionRequests","R1"),{"doctor.fullName":"changed"})));
await t("admin bad status value rejected", assertFails(updateDoc(doc(admin,"subscriptionRequests","R1"),{paymentStatus:"paid"})));
await t("admin audit log", assertSucceeds(addDoc(collection(admin,"subscriptionRequests","R1","auditLog"),{action:"x",by:"a",at:serverTimestamp()})));
await t("public cannot write audit log", assertFails(addDoc(collection(anon,"subscriptionRequests","R1","auditLog"),{action:"x",by:"a",at:serverTimestamp()})));
const act = (over={}) => ({requestId:"R1",activationStatus:"active",credentialsSent:false,startDate:Timestamp.fromDate(new Date("2026-11-01")),endDate:Timestamp.fromDate(new Date("2027-11-01")),...over});
await t("activation blocked before setup complete", assertFails(setDoc(doc(admin,"subscriptionActivations","R1"), act())));
await t("pending activation record allowed", assertSucceeds(setDoc(doc(admin,"subscriptionActivations","R1"), act({activationStatus:"pending"}))));
await updateDoc(doc(admin,"subscriptionRequests","R1"),{accountSetupStatus:"completed",websiteSetupStatus:"completed"});
await t("activation allowed after confirm+setup", assertSucceeds(setDoc(doc(admin,"subscriptionActivations","R1"), act(), {merge:true})));
await t("activation end before start rejected", assertFails(setDoc(doc(admin,"subscriptionActivations","R1"), act({endDate:Timestamp.fromDate(new Date("2026-01-01"))}))));
await t("activation id must match request", assertFails(setDoc(doc(admin,"subscriptionActivations","R10"), act())));
await t("activation for unknown request rejected", assertFails(setDoc(doc(admin,"subscriptionActivations","ZZ"), act({requestId:"ZZ",activationStatus:"pending"}))));
await t("public cannot read activations", assertFails(getDoc(doc(anon,"subscriptionActivations","R1"))));
await t("other user cannot write activation", assertFails(setDoc(doc(other,"subscriptionActivations","R10"), act({requestId:"R10",activationStatus:"pending"}))));
await t("existing promotion read still public", assertSucceeds(getDoc(doc(anon,"promotions","P1"))));
await t("admin promo with price+duration", assertSucceeds(setDoc(doc(admin,"promotions","P3"),{title:"t",description:"d",paymentUrl:PAY,buttonText:"b",status:"draft",displayOrder:1,priceText:"1500",durationMonths:12})));
// storage
const sAnon = cAnon.storage(), sAdmin = cAdm.storage();
const img = new Uint8Array(1000);
await t("public uploads photo", assertSucceeds(uploadBytes(ref(sAnon,"subscriptionRequests/R10/photo.jpg"), img, {contentType:"image/jpeg"})));
await t("public cannot overwrite photo", assertFails(uploadBytes(ref(sAnon,"subscriptionRequests/R10/photo.jpg"), img, {contentType:"image/jpeg"})));
await t("public cannot upload pdf", assertFails(uploadBytes(ref(sAnon,"subscriptionRequests/R10/logo.png"), img, {contentType:"application/pdf"})));
await t("public cannot upload >2MB", assertFails(uploadBytes(ref(sAnon,"subscriptionRequests/R11/logo.png"), new Uint8Array(2.1*1024*1024), {contentType:"image/png"})));
await t("public cannot use other filenames", assertFails(uploadBytes(ref(sAnon,"subscriptionRequests/R11/x.jpg"), img, {contentType:"image/jpeg"})));
await t("public cannot read photo", assertFails(getBytes(ref(sAnon,"subscriptionRequests/R10/photo.jpg"))));
await t("admin reads photo", assertSucceeds(getBytes(ref(sAdmin,"subscriptionRequests/R10/photo.jpg"))));
console.log(`\nRESULT ${pass} passed, ${fail} failed`);
await env.cleanup(); process.exit(fail?1:0);
