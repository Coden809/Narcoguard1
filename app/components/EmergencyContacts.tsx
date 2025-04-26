"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { encryptData } from "../utils/hipaaCompliance"
import { AlertCircle, Shield } from "lucide-react"

interface Contact {
  name: string
  phone: string
  email: string
  notify: boolean
  notificationMethod: "call" | "text" | "email"
}

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState<Contact[]>([
    { name: "", phone: "", email: "", notify: false, notificationMethod: "call" },
  ])
  const [allowHeroNetwork, setAllowHeroNetwork] = useState(false)

  const addContact = () => {
    setContacts([...contacts, { name: "", phone: "", email: "", notify: false, notificationMethod: "call" }])
  }

  const saveContacts = () => {
    const contactsData = {
      contacts,
      allowHeroNetwork,
    }
    const encryptedContacts = encryptData(JSON.stringify(contactsData))
    localStorage.setItem("emergencyContacts", encryptedContacts)
    // In a real application, you would send this to a secure server instead of using localStorage
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold mb-4">Set Up Emergency Contacts</h2>
      <p className="mb-4">
        Who should we call when things get dicey? Add your emergency contacts here. Remember, it could be Mom, your
        neighbor, or even Ghostbusters!
      </p>
      {contacts.map((contact, index) => (
        <motion.div
          key={index}
          className="mb-4 p-4 border rounded-lg bg-white/10 backdrop-blur-md"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Label htmlFor={`name-${index}`}>Name</Label>
          <Input
            id={`name-${index}`}
            value={contact.name}
            onChange={(e) => {
              const newContacts = [...contacts]
              newContacts[index].name = e.target.value
              setContacts(newContacts)
            }}
            className="mb-2"
          />
          <Label htmlFor={`phone-${index}`}>Phone</Label>
          <Input
            id={`phone-${index}`}
            value={contact.phone}
            onChange={(e) => {
              const newContacts = [...contacts]
              newContacts[index].phone = e.target.value
              setContacts(newContacts)
            }}
            className="mb-2"
          />
          <Label htmlFor={`email-${index}`}>Email</Label>
          <Input
            id={`email-${index}`}
            value={contact.email}
            onChange={(e) => {
              const newContacts = [...contacts]
              newContacts[index].email = e.target.value
              setContacts(newContacts)
            }}
            className="mb-2"
          />
          <div className="flex items-center space-x-2 mb-2">
            <Checkbox
              id={`notify-${index}`}
              checked={contact.notify}
              onCheckedChange={(checked) => {
                const newContacts = [...contacts]
                newContacts[index].notify = checked as boolean
                setContacts(newContacts)
              }}
            />
            <Label htmlFor={`notify-${index}`}>Notify in case of emergency</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Label>Notification Method:</Label>
            <select
              value={contact.notificationMethod}
              onChange={(e) => {
                const newContacts = [...contacts]
                newContacts[index].notificationMethod = e.target.value as "call" | "text" | "email"
                setContacts(newContacts)
              }}
              className="border rounded p-1 bg-white/20 text-white"
            >
              <option value="call">Call</option>
              <option value="text">Text</option>
              <option value="email">Email</option>
            </select>
          </div>
        </motion.div>
      ))}
      <motion.div
        className="mb-6 p-4 border rounded-lg bg-indigo-600/20 backdrop-blur-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-indigo-400" />
            <Label htmlFor="allow-hero-network" className="text-lg font-semibold">
              Allow Hero Network Assistance
            </Label>
          </div>
          <Switch id="allow-hero-network" checked={allowHeroNetwork} onCheckedChange={setAllowHeroNetwork} />
        </div>
        <p className="mt-2 text-sm text-white/80">
          By enabling this, you allow nearby heroes from the Narcoguard network to be notified and potentially assist in
          case of an emergency.
        </p>
      </motion.div>
      <div className="flex space-x-4">
        <Button onClick={addContact} className="mr-2">
          + Add another contact
        </Button>
        <Button onClick={saveContacts} variant="outline">
          Save Contacts
        </Button>
      </div>
      <motion.div
        className="mt-4 p-4 bg-yellow-500/20 rounded-lg flex items-start space-x-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
        <p className="text-sm">
          Remember, your emergency contacts and hero network preferences are crucial for your safety. Make sure to keep
          this information up to date and choose contacts you trust.
        </p>
      </motion.div>
    </motion.div>
  )
}
