document.addEventListener("DOMContentLoaded", () => {
    const usernameInput = document.getElementById("username");
    const coinCards = document.querySelectorAll(".coin-card:not(.custom-card)");
    const customCard = document.getElementById("custom-trigger");
    const customAmountInput = document.getElementById("custom-amount");
    const totalVal = document.getElementById("total-val");
    const chargeBtn = document.getElementById("charge-btn");
    
    // عناصر النافذة المنبثقة لحالة الشحن
    const overlay = document.getElementById("overlay");
    const loader = document.getElementById("loader");
    const successIcon = document.getElementById("success-icon");
    const statusText = document.getElementById("status-text");

    let selectedAmount = 0;
    let selectedPrice = 0;

    // دالة للتحقق من إمكانية تفعيل زر الشحن
    function validateForm() {
        const hasUser = usernameInput.value.trim() !== "";
        const hasSelection = selectedAmount > 0;
        chargeBtn.disabled = !(hasUser && hasSelection);
    }

    // عند اختيار باقة جاهزة
    coinCards.forEach(card => {
        card.addEventListener("click", () => {
            // إزالة الاختيار من الكروت الأخرى بما فيها المخصص
            document.querySelectorAll(".coin-card").forEach(c => c.classList.remove("selected"));
            customAmountInput.value = ""; 

            card.classList.add("selected");
            selectedAmount = parseInt(card.getAttribute("data-amount"));
            selectedPrice = parseFloat(card.getAttribute("data-price"));

            totalVal.textContent = `US$${selectedPrice.toFixed(2)}`;
            validateForm();
        });
    });

    // عند اختيار والتحكم في الباقة المخصصة
    customAmountInput.addEventListener("input", (e) => {
        document.querySelectorAll(".coin-card").forEach(c => c.classList.remove("selected"));
        customCard.classList.add("selected");

        const amount = parseInt(e.target.value);
        if (amount > 0) {
            selectedAmount = amount;
            // حساب تقريبي للسعر (بناءً على متوسط السعر في تيك توك: كل عملة بـ 0.0103 دولار تقريباً)
            selectedPrice = amount * 0.01034;
            totalVal.textContent = `US$${selectedPrice.toFixed(2)}`;
        } else {
            selectedAmount = 0;
            selectedPrice = 0;
            totalVal.textContent = "US$0";
        }
        validateForm();
    });

    usernameInput.addEventListener("input", validateForm);

    // عند الضغط على زر الشحن (بدء تأثيرات الشحن)
    chargeBtn.addEventListener("click", () => {
        const username = usernameInput.value.trim();
        
        // تجهيز الـ Popup على وضع "جاري الشحن"
        loader.style.display = "block";
        successIcon.style.display = "none";
        statusText.textContent = `جاري شحن عملات تيك توك لحساب (${username})...`;
        overlay.classList.add("active");

        // محاكاة عملية الشحن (تأخذ 3 ثواني)
        setTimeout(() => {
            loader.style.display = "none";
            successIcon.style.display = "block";
            statusText.innerHTML = `تم شحن <span style="color:#fe2c55; font-weight:bold;">${selectedAmount.toLocaleString()}</span> عملة بنجاح إلى اليوزر <span style="color:#121212; font-weight:bold;">${username}</span> 🎉`;
            
            // إغلاق النافذة تلقائياً بعد 4 ثواني من النجاح وإعادة تصغير البيانات
            setTimeout(() => {
                overlay.classList.remove("active");
                // تفريغ الحقول اختياري بعد النجاح:
                usernameInput.value = "";
                customAmountInput.value = "";
                document.querySelectorAll(".coin-card").forEach(c => c.classList.remove("selected"));
                totalVal.textContent = "US$0";
                chargeBtn.disabled = true;
            }, 4000);

        }, 3000);
    });
});
