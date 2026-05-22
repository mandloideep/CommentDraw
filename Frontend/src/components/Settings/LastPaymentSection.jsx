import { CreditCard } from "lucide-react";
import { useGetLastPaymentQuery } from "../../Redux/slices/apiSlice";

function Row({ label, value }) {
  return (
    <div className="border-t border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] py-4 flex flex-col gap-1">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
        {label}
      </p>
      <p className="font-display text-base">{value || "—"}</p>
    </div>
  );
}

function LastPaymentSection() {
  const { data: lastPaymentData } = useGetLastPaymentQuery();

  return (
    <section className="border border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute">
          <span className="text-[var(--color-punch)]">04</span> / Payment
        </p>
        <CreditCard size={16} className="text-mute" strokeWidth={1.75} />
      </div>

      <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] mb-2">
        Last payment
      </h2>
      <p className="text-sm text-mute mb-8">Your most recent billing record.</p>

      {lastPaymentData ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
          <Row label="Payment ID" value={lastPaymentData.paymentId} />
          <Row
            label="Amount"
            value={
              lastPaymentData.amount ? `$${lastPaymentData.amount}` : null
            }
          />
          <Row label="Plan" value={lastPaymentData.subscriptionType} />
          <Row
            label="Period"
            value={
              lastPaymentData.periodStart && lastPaymentData.periodEnd
                ? `${lastPaymentData.periodStart} – ${lastPaymentData.periodEnd}`
                : null
            }
          />
          {lastPaymentData?.nextBillingDate && (
            <div className="col-span-full border-t border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] pt-4 mt-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">
                Next billing
              </p>
              <p className="font-display text-base mt-1">
                {lastPaymentData.nextBillingDate}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="border-t border-[var(--color-rule)] dark:border-[var(--color-rule-dark)] pt-8 flex flex-col items-center text-center gap-3 pb-4">
          <CreditCard size={32} className="text-mute" strokeWidth={1.5} />
          <p className="text-sm text-mute max-w-sm">
            No payment records yet. Your billing history will appear here once you
            upgrade.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute mt-2">
            Currently on the FREE plan
          </p>
        </div>
      )}
    </section>
  );
}

export default LastPaymentSection;
