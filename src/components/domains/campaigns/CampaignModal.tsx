import React, { useState } from 'react';
import { X } from 'lucide-react';
import { createCampaign } from '@/app/actions/campaigns';
import toast from 'react-hot-toast';

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CampaignModal: React.FC<CampaignModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    advertiser: '',
    budget: '',
    roas: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = e.target as HTMLFormElement;
      const formDataToSubmit = new FormData(form);
      formDataToSubmit.set('budget', formData.budget);
      formDataToSubmit.set('roas', formData.roas);

      await createCampaign(formDataToSubmit);

      onSuccess();
      onClose();
      setFormData({ name: '', advertiser: '', budget: '', roas: '' });
      toast.success('새 캠페인이 추가되었습니다.');
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      toast.error(`캠페인 생성 실패: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">새 캠페인 추가</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100 text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">캠페인명</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="e.g. 2024 S/S Promotion"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="advertiser" className="text-sm font-medium text-gray-700">광고주</label>
            <input
              id="advertiser"
              name="advertiser"
              type="text"
              required
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="e.g. Samsung Electronics"
              value={formData.advertiser}
              onChange={(e) => setFormData({ ...formData, advertiser: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="budget" className="text-sm font-medium text-gray-700">예산 (KRW)</label>
              <input
                id="budget"
                name="budget"
                type="number"
                required
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="0"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="roas" className="text-sm font-medium text-gray-700">Target ROAS</label>
              <input
                id="roas"
                name="roas"
                type="number"
                step="0.1"
                required
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="0.0"
                value={formData.roas}
                onChange={(e) => setFormData({ ...formData, roas: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm shadow-blue-200"
            >
              {isSubmitting ? '추가 중...' : '캠페인 추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CampaignModal;
