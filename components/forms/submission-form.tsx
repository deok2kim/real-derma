'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

type ToastState = { message: string; type: 'success' | 'error' } | null;

export function SubmissionForm() {
  const [clinicName, setClinicName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');
  const [contact, setContact] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinicName: clinicName.trim(),
          address: address.trim(),
          phone: phone.trim() || null,
          reason: reason.trim() || null,
          contact: contact.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? '제출에 실패했습니다.');
      }

      showToast('제보가 접수되었습니다. 검토 후 반영됩니다. 감사합니다!', 'success');
      setClinicName('');
      setAddress('');
      setPhone('');
      setReason('');
      setContact('');
    } catch (err) {
      showToast(err instanceof Error ? err.message : '오류가 발생했습니다.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Clinic name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="clinic-name" className="text-sm font-medium text-gray-700">
            병원명 <span className="text-red-500">*</span>
          </label>
          <input
            id="clinic-name"
            type="text"
            value={clinicName}
            onChange={(e) => setClinicName(e.target.value)}
            required
            placeholder="예: 서울 피부과 의원"
            maxLength={100}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Address */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="address" className="text-sm font-medium text-gray-700">
            주소 <span className="text-red-500">*</span>
          </label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="예: 서울특별시 강남구 테헤란로 123"
            maxLength={200}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm font-medium text-gray-700">
            전화번호 <span className="text-gray-400 font-normal">(선택)</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="예: 02-1234-5678"
            maxLength={20}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Reason */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="reason" className="text-sm font-medium text-gray-700">
            진짜 피부과인 이유 <span className="text-gray-400 font-normal">(선택)</span>
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="건강보험 진료를 하는 피부과임을 확인한 이유를 알려주세요."
            rows={4}
            maxLength={1000}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <p className="text-xs text-gray-400 text-right">{reason.length}/1000</p>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact" className="text-sm font-medium text-gray-700">
            연락처 이메일 <span className="text-gray-400 font-normal">(선택)</span>
          </label>
          <input
            id="contact"
            type="email"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="example@email.com"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-400">검토 결과를 받아보려면 이메일을 입력하세요.</p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting || !clinicName.trim() || !address.trim()}
          className={cn(
            'w-full py-3 rounded-lg text-sm font-semibold transition-colors',
            submitting || !clinicName.trim() || !address.trim()
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          )}
        >
          {submitting ? '제출 중...' : '제보 제출'}
        </button>
      </form>

      {/* Toast */}
      {toast && (
        <div
          className={cn(
            'fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-lg shadow-lg text-sm font-medium text-white z-50 max-w-sm text-center',
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          )}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
