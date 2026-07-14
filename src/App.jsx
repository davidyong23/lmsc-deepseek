import TopBar from './components/layout/TopBar'
import KPICards from './components/dashboard/KPICards'
import RouteChart from './components/dashboard/RouteChart'
import BatteryChart from './components/dashboard/BatteryChart'
import FleetTable from './components/dashboard/FleetTable'
import CongestionPanel from './components/dashboard/CongestionPanel'
import ChatPanel from './components/chat/ChatPanel'
import { useChat } from './hooks/useChat'
import { useState } from 'react'

export default function App() {
  // Single chat state shared by the desktop and mobile panels — both are
  // always mounted (CSS toggles visibility), so the conversation must not
  // reset when the viewport crosses the lg breakpoint.
  const chat = useChat()

  // The chat input draft lives here too, so a click on the fleet table can
  // hand a question to whichever chat panel is visible.
  const [draft, setDraft] = useState('')
  const [focusSignal, setFocusSignal] = useState(0)

  // Drafts a question about the clicked vehicle and focuses the input rather
  // than sending straight away — the operator stays in control of what is asked.
  const askAboutVehicle = (question) => {
    setDraft(question)
    setFocusSignal(n => n + 1)
  }

  const chatProps = { ...chat, draft, onDraftChange: setDraft, focusSignal }

  return (
    <div className="flex flex-col h-screen bg-base overflow-hidden">
      <TopBar />

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT — Dashboard panel */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-w-0">
          <KPICards />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <RouteChart />
            <BatteryChart />
          </div>
          <FleetTable onAskAboutVehicle={askAboutVehicle} />
          <CongestionPanel />

          {/* Footer padding */}
          <div className="h-2" />
        </div>

        {/* RIGHT — Chat panel (fixed width, full height) */}
        <div className="hidden lg:flex lg:flex-col w-full max-w-md flex-shrink-0 border-l border-border p-4 min-h-0">
          <ChatPanel {...chatProps} />
        </div>
      </div>

      {/* Mobile: Chat panel below dashboard */}
      <div className="lg:hidden border-t border-border h-[50vh] min-h-[320px]">
        <div className="h-full p-3">
          <ChatPanel {...chatProps} />
        </div>
      </div>
    </div>
  )
}
