"use client"

import { motion } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function EndUserAgreement({ agreed, setAgreed }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h2 className="text-2xl font-bold mb-4">End User Agreement</h2>
      <p className="mb-4">
        Before we wrap up, let's go over some important points. By using Narcoguard, you agree to the following:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>
          Your personal information will be handled in accordance with HIPAA regulations. Your data's as safe as Fort
          Knox for bytes.
        </li>
        <li>
          You'll provide accurate and current contact information for those who will be notified in case of an
          emergency.
        </li>
        <li>
          You acknowledge the importance of having naloxone readily available and agree to place it in a predetermined
          location.
        </li>
        <li>
          You understand that Hero Mode is designed to help you assist others and provide life-saving measures in
          emergencies.
        </li>
      </ul>
      <div className="flex items-center space-x-2">
        <Checkbox id="agreement" checked={agreed} onCheckedChange={setAgreed} />
        <Label htmlFor="agreement">I agree to the terms and conditions</Label>
      </div>
      <p className="mt-4">
        Remember, Narcoguard is here to help save lives. By agreeing to these terms, you're taking an important step in
        being prepared for emergencies and potentially helping others in need.
      </p>
    </motion.div>
  )
}
