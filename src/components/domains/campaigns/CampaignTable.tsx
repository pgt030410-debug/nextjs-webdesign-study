/**
 * Campaigns Domain: 외부에서 주입받은 캠페인 데이터를 테이블 형태로 렌더링
 */

import React from 'react';
import { Trash2 } from 'lucide-react';

export interface Campaign {
  id: number;
  name: string;
  advertiser: string;
  budget: number;
  roas: number;
  status: 'active' | 'paused' | 'ended';
}

interface CampaignTableProps {
  data: Campaign[];
  onDelete?: (id: number) => void;
}

const CampaignTable: React.FC<CampaignTableProps> = ({ data, onDelete }) => {
  if (data.length === 0) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-8">
        <p className="text-gray-500">등록된 캠페인이 없습니다.</p>
      </div>
    );
  }

  const handleDelete = (id: number, name: string) => {
    if (confirm(`'${name}' 캠페인을 삭제하시겠습니까?`)) {
      onDelete?.(id);
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full border-collapse text-left text-sm text-gray-700">
        <thead className="bg-gray-50 font-medium text-gray-500">
          <tr>
            <th className="px-6 py-4">Campaign Name</th>
            <th className="px-6 py-4">Advertiser</th>
            <th className="px-6 py-4 text-right">Budget (KRW)</th>
            <th className="px-6 py-4 text-center">ROAS</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((campaign) => (
            <tr key={campaign.id} className="transition-colors hover:bg-gray-50/50">
              <td className="px-6 py-4 font-semibold text-gray-900">{campaign.name}</td>
              <td className="px-6 py-4 text-gray-500">{campaign.advertiser}</td>
              <td className="px-6 py-4 text-right font-mono">{campaign.budget.toLocaleString()}</td>
              <td className="px-6 py-4 text-center font-bold text-blue-600">{campaign.roas}x</td>
              <td className="px-6 py-4 text-center">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  campaign.status === 'active' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => handleDelete(campaign.id, campaign.name)}
                  className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                  aria-label="Delete campaign"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignTable;
