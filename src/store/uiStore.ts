import { create } from 'zustand';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface UIState {
  toasts: Toast[];
  isLoadingOverlay: boolean;
  loadingMessage: string | null;
  activeBottomSheet: string | null;
  showToast: (message: string, variant?: ToastVariant) => void;
  dismissToast: (id: string) => void;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  setBottomSheet: (id: string | null) => void;
}

export const useUIStore = create<UIState>(set => ({
  toasts: [],
  isLoadingOverlay: false,
  loadingMessage: null,
  activeBottomSheet: null,
  showToast: (message, variant = 'info') => {
    const id = `t_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    set(s => ({ toasts: [...s.toasts, { id, message, variant }] }));
    setTimeout(() => {
      set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }));
    }, 3500);
  },
  dismissToast: id => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
  showLoading: message => set({ isLoadingOverlay: true, loadingMessage: message ?? null }),
  hideLoading: () => set({ isLoadingOverlay: false, loadingMessage: null }),
  setBottomSheet: id => set({ activeBottomSheet: id }),
}));
