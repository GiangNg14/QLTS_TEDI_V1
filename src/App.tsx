import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { SUBNAV_ITEMS } from './components/SidebarNav';
import { IsoProcessGuideModal } from './components/IsoProcessGuideModal';
import { PrintA4Modal } from './components/PrintA4Modal';

// Screens
import { PlanScreen } from './components/screens/PlanScreen';
import { RequisitionScreen } from './components/screens/RequisitionScreen';
import { QuotationScreen } from './components/screens/QuotationScreen';
import { SupplierEvalScreen } from './components/screens/SupplierEvalScreen';
import { ExpertScreen } from './components/screens/ExpertScreen';
import { ContractScreen } from './components/screens/ContractScreen';
import { AcceptanceScreen } from './components/screens/AcceptanceScreen';
import { GoodsReceiptScreen } from './components/screens/GoodsReceiptScreen';
import { SuppliesScreen } from './components/screens/SuppliesScreen';
import { AssetScreen } from './components/screens/AssetScreen';
import { VendorBillScreen } from './components/screens/VendorBillScreen';
import { TransferScreen } from './components/screens/TransferScreen';
import { HandoverScreen } from './components/screens/HandoverScreen';
import { InventoryCheckScreen } from './components/screens/InventoryCheckScreen';
import { DisposalScreen } from './components/screens/DisposalScreen';
import { SoftwareScreen } from './components/screens/SoftwareScreen';
import { MaintenanceScreen } from './components/screens/MaintenanceScreen';
import { MaintenanceRequestScreen } from './components/screens/MaintenanceRequestScreen';
import { ConstructionBudgetScreen } from './components/screens/ConstructionBudgetScreen';
import { BudgetVsActualScreen } from './components/screens/BudgetVsActualScreen';
import { OpenIssuesScreen } from './components/screens/OpenIssuesScreen';
import { ConfigScreen } from './components/screens/ConfigScreen';
import { AuditLogsScreen } from './components/screens/AuditLogsScreen';

function MainLayout() {
  const [activeGroup, setActiveGroup] = useState<string>('taisan');
  const [activeScreen, setActiveScreen] = useState<string>('mh6');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [isIsoGuideOpen, setIsIsoGuideOpen] = useState<boolean>(false);
  const [printModalConfig, setPrintModalConfig] = useState<{ type: string; data?: any } | null>(null);

  const handleNavigate = (screenId: string, recordId?: string) => {
    // Find which group owns screenId
    for (const [groupKey, items] of Object.entries(SUBNAV_ITEMS)) {
      if (items.some(it => it.id === screenId)) {
        setActiveGroup(groupKey);
        break;
      }
    }
    setActiveScreen(screenId);
    if (recordId !== undefined) {
      setSelectedRecordId(recordId);
    }
  };

  const renderActiveScreen = () => {
    switch (activeScreen) {
      // MUA SẮM
      case 'mh18':
        return <PlanScreen onNavigate={handleNavigate} />;
      case 'mh1':
        return <RequisitionScreen selectedId={selectedRecordId} onNavigate={handleNavigate} />;
      case 'mh2':
        return <QuotationScreen onNavigate={handleNavigate} />;
      case 'mh15':
      case 'mh3':
        return <SupplierEvalScreen onNavigate={handleNavigate} />;
      case 'mh14':
        return <ExpertScreen onNavigate={handleNavigate} />;
      case 'mh17':
        return <ContractScreen onNavigate={handleNavigate} />;
      case 'mh16':
        return <AcceptanceScreen onNavigate={handleNavigate} />;

      // KHO & VẬT TƯ
      case 'pbg':
        return <HandoverScreen selectedId={selectedRecordId} onNavigate={handleNavigate} />;
      case 'mh4':
        return <GoodsReceiptScreen selectedId={selectedRecordId} onNavigate={handleNavigate} />;
      case 'mh5':
        return <SuppliesScreen onNavigate={handleNavigate} />;

      // TÀI SẢN & BẢO TRÌ
      case 'mh6':
        return <AssetScreen selectedId={selectedRecordId} onNavigate={handleNavigate} />;
      case 'bill':
        return <VendorBillScreen onNavigate={handleNavigate} />;
      case 'mh10':
        return <TransferScreen onNavigate={handleNavigate} />;
      case 'mh9':
        return <InventoryCheckScreen onNavigate={handleNavigate} />;
      case 'mh11':
        return <DisposalScreen onNavigate={handleNavigate} />;
      case 'mh13':
        return <SoftwareScreen selectedId={selectedRecordId} onNavigate={handleNavigate} />;
      case 'mh7':
        return <MaintenanceScreen onNavigate={handleNavigate} />;
      case 'mh8':
        return <MaintenanceRequestScreen onNavigate={handleNavigate} />;
      case 'mh12':
        return <ConstructionBudgetScreen selectedId={selectedRecordId} onNavigate={handleNavigate} />;

      // BÁO CÁO & CẤU HÌNH
      case 'mh19':
        return <BudgetVsActualScreen onNavigate={handleNavigate} />;
      case 'oi':
        return <OpenIssuesScreen onNavigate={handleNavigate} />;
      case 'cfg':
      case 'scope':
        return <ConfigScreen onNavigate={handleNavigate} />;
      case 'logs':
        return <AuditLogsScreen onNavigate={handleNavigate} />;

      default:
        return <AssetScreen selectedId={selectedRecordId} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col text-slate-800 font-sans antialiased">
      <Header
        activeGroup={activeGroup}
        setActiveGroup={setActiveGroup}
        activeScreen={activeScreen}
        setActiveScreen={(s) => handleNavigate(s)}
        onOpenIsoGuide={() => setIsIsoGuideOpen(true)}
      />

      <main className="flex-1 w-full px-2 sm:px-4 py-2">
        {renderActiveScreen()}
      </main>

      {/* ISO Process Guide Modal */}
      {isIsoGuideOpen && (
        <IsoProcessGuideModal
          onClose={() => setIsIsoGuideOpen(false)}
          onOpenPrintModal={(type, data) => {
            setPrintModalConfig({ type, data });
          }}
        />
      )}

      {/* Global ISO / Standard A4 Form Print Modal */}
      {printModalConfig && (
        <PrintA4Modal
          type={printModalConfig.type}
          data={printModalConfig.data}
          onClose={() => setPrintModalConfig(null)}
        />
      )}

      <footer className="w-full bg-white border-t border-slate-200 py-2.5 px-4 text-center text-xs text-slate-500">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <span>© 2026 TEDI — Tổng Công ty Tư vấn Thiết kế Giao thông Vận tải. Hệ thống Quản lý Mua sắm &amp; Tài sản.</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsIsoGuideOpen(true)}
              className="text-blue-700 hover:underline font-bold"
            >
              📘 Quy trình TEDI-ISO-QT 02 (01/06/2017)
            </button>
            <span className="font-mono text-slate-400">Phiên bản Odoo Community Custom (tedi_asset)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
