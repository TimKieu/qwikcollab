export default function Modal ({modalOpen, setModalOpen, children, modalClasses}: any) {
  return (
    <div className={`modal modal-open ${modalOpen ? 'visible' : 'invisible'}`}>
      <div className={`modal-box relative bg-slate-700 ${modalClasses}`}>
        <label
          htmlFor="my-modal-3"
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={() => {
            setModalOpen(false);
          }}
        >
          ✕
        </label>
        <div>
          {children}
        </div>
      </div>
    </div>
  )
}
