import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStatusStore = create(
 
  persist(

    (set) => ({
      userStatus: true,
      // 보호자은 true / 간병인는 false
      setUserStatus: (status) =>
        
        set(() => ({
          userStatus: status,
        })),
    }),
    {
      name: 'status-storage',
      // storage: localStorage, //기본값
      partialize: (state) => ({
        userStatus: state.userStatus,
      }),
    }
  )


);

export default useUserStatusStore;
