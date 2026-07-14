import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ArrowLeft, Check, Ban, Banknote } from "lucide-react";
import {
  fetchWithdrawalById,
  approveWithdrawal,
  rejectWithdrawal,
  payWithdrawal,
  clearSelectedWithdrawal,
} from "../features/withdrawals/withdrawalsSlice";

const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-[#C9A15C]/10 text-[#C9A15C] border-[#C9A15C]/30",
    Approved: "bg-[#5B8DEF]/10 text-[#5B8DEF] border-[#5B8DEF]/30",
    Rejected: "bg-[#E5484D]/10 text-[#E5484D] border-[#E5484D]/30",
    Paid: "bg-[#4ADE80]/10 text-[#4ADE80] border-[#4ADE80]/30",
  };
  return (
    <span
      className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded border ${
        styles[status] || styles.Pending
      }`}
    >
      {status}
    </span>
  );
};

const Field = ({ label, value }) => (
  <div>
    <p className="font-mono text-[10px] tracking-[0.15em] text-[#8991A8] uppercase mb-1">
      {label}
    </p>
    <p className="text-sm text-[#EDEFF4]">{value ?? "—"}</p>
  </div>
);

const Section = ({ title, children }) => (
  <div className="bg-[#161B2C] border border-[#2A3142] rounded-md p-5 mb-6">
    <p className="font-mono text-[10px] tracking-[0.15em] text-[#C9A15C] uppercase mb-4">
      {title}
    </p>
    {children}
  </div>
);

const WithdrawalDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    selectedSeller,
    selectedWithdrawal,
    bankDetails,
    earningsSummary,
    detailStatus,
    actionStatus,
  } = useSelector((state) => state.withdrawals);

  const [remarks, setRemarks] = useState("");
  const [transactionId, setTransactionId] = useState("");
console.log(bankDetails);

  useEffect(() => {
    dispatch(fetchWithdrawalById(id));
    return () => {
      dispatch(clearSelectedWithdrawal());
    };
  }, [dispatch, id]);

  const handleApprove = async () => {
    const result = await dispatch(approveWithdrawal({ id, remarks }));
    if (approveWithdrawal.fulfilled.match(result)) {
      toast.success("Withdrawal approved.");
      setRemarks("");
    } else {
      toast.error(result.payload || "Failed to approve withdrawal");
    }
  };

  const handleReject = async () => {
    if (!remarks.trim()) {
      toast.error("Remarks are required when rejecting a withdrawal.");
      return;
    }
    const result = await dispatch(rejectWithdrawal({ id, remarks }));
    if (rejectWithdrawal.fulfilled.match(result)) {
      toast.success("Withdrawal rejected.");
      setRemarks("");
    } else {
      toast.error(result.payload || "Failed to reject withdrawal");
    }
  };

  const handleMarkPaid = async () => {
    if (!transactionId.trim()) {
      toast.error("Transaction ID is required to mark as paid.");
      return;
    }
    const result = await dispatch(
      payWithdrawal({ id, transactionId, remarks })
    );
    if (payWithdrawal.fulfilled.match(result)) {
      toast.success("Withdrawal marked as paid.");
      setTransactionId("");
      setRemarks("");
    } else {
      toast.error(result.payload || "Failed to mark withdrawal as paid");
    }
  };

  if (detailStatus === "loading" || !selectedWithdrawal) {
    return (
      <div className="flex items-center justify-center py-24">
        <span className="h-6 w-6 rounded-full border-2 border-[#2A3142] border-t-[#C9A15C] animate-spin" />
      </div>
    );
  }

  const status = selectedWithdrawal.status;
  const loading = actionStatus === "loading";

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to="/withdrawals"
        className="inline-flex items-center gap-2 text-sm text-[#8991A8] hover:text-[#EDEFF4] transition mb-6"
      >
        <ArrowLeft size={15} />
        Back to Withdrawals
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-[#EDEFF4]">
          {currency(selectedWithdrawal.amount)} withdrawal request
        </h1>
        <StatusBadge status={status} />
      </div>

      <Section title="Seller Information">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Seller Name" value={selectedSeller?.ownername} />
          <Field label="Shop Name" value={selectedSeller?.shopname} />
          <Field label="Email" value={selectedSeller?.email} />
          <Field label="Phone" value={selectedSeller?.phone} />
        </div>
      </Section>

      <Section title="Earnings Summary">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field
            label="Total Earnings"
            value={currency(earningsSummary?.totalEarnings)}
          />
          <Field
            label="Paid Out"
            value={currency(earningsSummary?.totalPaidOut)}
          />
          <Field label="Locked" value={currency(earningsSummary?.totalLocked)} />
          <Field
            label="Available Balance"
            value={currency(earningsSummary?.availableBalance)}
          />
        </div>
      </Section>

      <Section title="Withdrawal Information">
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Withdrawal Amount"
            value={currency(selectedWithdrawal.amount)}
          />
          <Field label="Status" value={status} />
          <Field
            label="Requested Date"
            value={formatDate(selectedWithdrawal.requestedAt)}
          />
          <Field
            label="Processed Date"
            value={formatDate(selectedWithdrawal.processedAt)}
          />
          <Field label="Remarks" value={selectedWithdrawal.remarks} />
          {selectedWithdrawal.transactionId && (
            <Field
              label="Transaction ID"
              value={selectedWithdrawal.transactionId}
            />
          )}
        </div>
      </Section>

      <Section title="Bank Details">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Account Holder" value={bankDetails?.accountHolderName} />
          <Field label="Account Number" value={bankDetails?.accountNumber} />
          <Field label="IFSC" value={bankDetails?.ifscCode} />
          <Field label="Bank" value={bankDetails?.bankName} />
          <Field label="Branch" value={bankDetails?.branch} />
        </div>
      </Section>

      {/* status-dependent actions */}
      {status === "Pending" && (
        <Section title="Actions">
          <div className="mb-4">
            <label className="block font-mono text-[10px] tracking-[0.15em] text-[#8991A8] uppercase mb-2">
              Remarks
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              placeholder="Required if rejecting, optional if approving..."
              className="w-full bg-[#0F1320] border border-[#2A3142] rounded-md px-3 py-2 text-sm text-[#EDEFF4] placeholder:text-[#565F78] focus:outline-none focus:ring-2 focus:ring-[#C9A15C]/50 resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReject}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 border border-[#E5484D]/40 text-[#E5484D] hover:bg-[#E5484D]/10 disabled:opacity-50 text-sm font-medium rounded-md py-2.5 transition"
            >
              <Ban size={15} />
              Reject
            </button>
            <button
              onClick={handleApprove}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-[#4ADE80] hover:bg-[#5EE896] disabled:opacity-50 text-[#0F1320] text-sm font-semibold rounded-md py-2.5 transition"
            >
              {loading ? (
                <span className="h-4 w-4 rounded-full border-2 border-[#0F1320]/40 border-t-[#0F1320] animate-spin" />
              ) : (
                <Check size={15} />
              )}
              Approve
            </button>
          </div>
        </Section>
      )}

      {status === "Approved" && (
        <Section title="Actions">
          <div className="mb-4">
            <label className="block font-mono text-[10px] tracking-[0.15em] text-[#8991A8] uppercase mb-2">
              Transaction ID
            </label>
            <input
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="e.g. UTR12345678"
              className="w-full bg-[#0F1320] border border-[#2A3142] rounded-md px-3 py-2.5 text-sm text-[#EDEFF4] placeholder:text-[#565F78] focus:outline-none focus:ring-2 focus:ring-[#C9A15C]/50"
            />
          </div>
          <div className="mb-4">
            <label className="block font-mono text-[10px] tracking-[0.15em] text-[#8991A8] uppercase mb-2">
              Remarks
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              placeholder="Optional..."
              className="w-full bg-[#0F1320] border border-[#2A3142] rounded-md px-3 py-2 text-sm text-[#EDEFF4] placeholder:text-[#565F78] focus:outline-none focus:ring-2 focus:ring-[#C9A15C]/50 resize-none"
            />
          </div>
          <button
            onClick={handleMarkPaid}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#C9A15C] hover:bg-[#D9B36E] disabled:opacity-50 text-[#161B2C] text-sm font-semibold rounded-md py-2.5 transition"
          >
            {loading ? (
              <span className="h-4 w-4 rounded-full border-2 border-[#161B2C]/40 border-t-[#161B2C] animate-spin" />
            ) : (
              <Banknote size={15} />
            )}
            Mark as Paid
          </button>
        </Section>
      )}
    </div>
  );
};

export default WithdrawalDetails;