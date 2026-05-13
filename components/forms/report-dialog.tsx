'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { REPORT_TYPES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ReportDialogProps {
  clinicId: string;
  clinicName: string;
  onClose: () => void;
}

type ReportType = keyof typeof REPORT_TYPES;

type ToastState = { message: string; type: 'success' | 'error' } | null;

export function ReportDialog({ clinicId, clinicName, onClose }: ReportDialogProps) {
  const [reportType, setReportType] = useState<ReportType | ''>('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportType) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinicId,
          reportType,
          description: description.trim() || null,
          contact: contact.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? '신고 접수에 실패했습니다.');
      }

      showToast('신고가 접수되었습니다. 감사합니다.', 'success');
      setTimeout(onClose, 1800);
    } catch (err) {
      showToast(err instanceof Error ? err.message : '오류가 발생했습니다.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal */}
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">정보 오류 신고</h2>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{clinicName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="닫기"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 py-4 flex flex-col gap-4">
          {/* Report type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              신고 유형 <span className="text-red-500">*</span>
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">선택해주세요</option>
              {(Object.entries(REPORT_TYPES) as [ReportType, string][]).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              상세 내용 <span className="text-gray-400 font-normal">(선택)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="오류 내용을 자세히 알려주세요."
              rows={3}
              maxLength={500}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-400 text-right">{description.length}/500</p>
          </div>

          {/* Contact email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              연락처 이메일 <span className="text-gray-400 font-normal">(선택)</span>
            </label>
            <input
              type="email"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="example@email.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!reportType || submitting}
            className={cn(
              'w-full py-2.5 rounded-lg text-sm font-semibold transition-colors',
              !reportType || submitting
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            )}
          >
            {submitting ? '제출 중...' : '신고 접수'}
          </button>
        </form>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={cn(
            'fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white transition-all z-50',
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          )}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
