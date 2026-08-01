// --- Modal and Transaction Logic for Bank Dashboard ---

document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const actions = ['Send Money', 'Deposit', 'Withdraw'];
    const quickActions = document.querySelectorAll('.quick-actions button');
    const transactionsTable = document.querySelector('.transactions tbody');
    const logoutBtn = document.querySelector('.logout');

    // Create modal
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = 0;
    modal.style.left = 0;
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.3)';
    modal.style.display = 'none';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = 1000;
    modal.innerHTML = `
        <div id="modal-content" style="background:#fff;padding:32px 24px;border-radius:10px;min-width:320px;box-shadow:0 2px 16px rgba(0,0,0,0.15);position:relative;">
            <button id="modal-close" style="position:absolute;top:8px;right:12px;background:none;border:none;font-size:1.3em;cursor:pointer;">&times;</button>
            <h2 id="modal-title"></h2>
            <form id="modal-form">
                <div style="margin-bottom:16px;">
                    <label>Description:<br><input type="text" name="desc" required style="width:100%;padding:6px 8px;margin-top:4px;"></label>
                </div>
                <div style="margin-bottom:16px;">
                    <label>Amount:<br><input type="number" name="amount" required min="0.01" step="0.01" style="width:100%;padding:6px 8px;margin-top:4px;"></label>
                </div>
                <button type="submit" style="background:#3949ab;color:#fff;border:none;padding:10px 20px;border-radius:6px;cursor:pointer;">Submit</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    function showModal(action) {
        modal.style.display = 'flex';
        document.getElementById('modal-title').textContent = action;
        document.getElementById('modal-form').reset();
    }
    function hideModal() {
        modal.style.display = 'none';
    }
    modal.querySelector('#modal-close').onclick = hideModal;
    modal.onclick = function (e) {
        if (e.target === modal) hideModal();
    };

    // Get balance element and parse initial balance
    const balanceElem = document.querySelector('.account-balance');
    function parseBalance(str) {
        return parseFloat(str.replace(/[^\d.-]/g, ''));
    }
    let currentBalance = parseBalance(balanceElem.textContent);

    function updateBalanceDisplay() {
        balanceElem.textContent = `$${currentBalance.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
    }

    // Add transaction to table and update balance
    function addTransaction({ date, desc, type, amount }) {
        const amt = parseFloat(amount);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${date}</td>
            <td>${desc}</td>
            <td>${type}</td>
            <td>${type === 'Debit' ? '-' : '+'}$${amt.toFixed(2)}</td>
        `;
        transactionsTable.insertBefore(tr, transactionsTable.firstChild);
        // Update balance
        if (type === 'Credit') {
            currentBalance += amt;
        } else {
            currentBalance -= amt;
        }
        updateBalanceDisplay();
    }

    quickActions.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
            showModal(actions[idx]);
        });
    });

    document.getElementById('modal-form').onsubmit = function (e) {
        e.preventDefault();
        const action = document.getElementById('modal-title').textContent;
        const desc = this.desc.value.trim();
        const amount = this.amount.value;
        if (!desc || !amount) return;
        const today = new Date();
        const dateStr = today.toISOString().slice(0, 10);
        let type = 'Debit';
        if (action === 'Deposit' || action === 'Send Money') type = action === 'Deposit' ? 'Credit' : 'Debit';
        if (action === 'Withdraw') type = 'Debit';
        addTransaction({ date: dateStr, desc, type, amount });
        hideModal();
    };

    logoutBtn.addEventListener('click', function () {
        if (confirm('Are you sure you want to logout?')) {
            window.location.href = '/'; 
        }
    });
}); 