document.addEventListener('DOMContentLoaded', function () {
    const questionMarks = document.querySelectorAll('.question-mark');
    const form = document.getElementById('taxForm');
    const grossIncomeInput = document.getElementById('grossIncome');
    const extraIncomeInput = document.getElementById('extraIncome');
    const deductionsInput = document.getElementById('deductions');
    const ageSelect = document.getElementById('age');
    const submitBtn = document.getElementById('submitBtn');
    const resultCard = document.getElementById('resultCard');
    const cardContent = document.getElementById('cardContent');
    const closeBtn = document.getElementById('closeBtn');
    const taxResult = document.getElementById('taxResult');

    // question mark hover tooltip
    questionMarks.forEach(questionMark => {
        let tooltipTimeout;

        questionMark.addEventListener('mouseenter', function () {
            const message = this.getAttribute('data-message');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = message;
            this.appendChild(tooltip);

           
            const rect = this.getBoundingClientRect();
            tooltip.style.top = rect.top + rect.height + 'px';
            tooltip.style.left = rect.left + 'px';
            tooltipTimeout = setTimeout(() => {
                tooltip.style.display = 'block';
            }, 500);
        });

        questionMark.addEventListener('mouseleave', function () {
            const tooltip = this.querySelector('.tooltip');
            clearTimeout(tooltipTimeout);
            if (tooltip) {
                tooltip.parentNode.removeChild(tooltip);
            }
        });
    });


    function isNumeric(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    // Error icon and message
    function showError(input, message) {
        const errorIcon = input.nextElementSibling;
        errorIcon.style.display = 'inline-block';
        errorIcon.title = message;
    }

    // hide error icon
    function hideError(input) {
        const errorIcon = input.nextElementSibling;
        errorIcon.style.display = 'none';
    }

    // validate input fields
    function validateInputs() {
        let isValid = true;

        // validate gross annual income
        if (!isNumeric(grossIncomeInput.value.trim())) {
            showError(grossIncomeInput,'');
            isValid = false;
        } else {
            hideError(grossIncomeInput);
        }

        // validate exrtr income
        if (extraIncomeInput.value.trim() && !isNumeric(extraIncomeInput.value.trim())) {
            showError(extraIncomeInput, '');
            isValid = false;
        } else {
            hideError(extraIncomeInput);
        }

        // validate deductions
        if (deductionsInput.value.trim() && !isNumeric(deductionsInput.value.trim())) {
            showError(deductionsInput, '');
            isValid = false;
        } else {
            hideError(deductionsInput);
        }

        // age validation
        if (!ageSelect.value.trim()) {
            showError(ageSelect,'');
            isValid = false;
        } else {
            hideError(ageSelect);
        }

        return isValid;
    }

    
    // calculate tax
    function calculateTax() {
        const grossIncome = parseFloat(grossIncomeInput.value.trim());
        const extraIncome = parseFloat(extraIncomeInput.value.trim()) || 0;
        const deductions = parseFloat(deductionsInput.value.trim()) || 0;
        const age = ageSelect.value.trim();

        let tax = 0;

        if (grossIncome + extraIncome - deductions > 800000) {
            const taxableAmount = grossIncome + extraIncome - deductions - 800000;

            switch (age) {
                case '<40':
                    tax = taxableAmount * 0.3;
                    break;
                case '>=40&<60':
                    tax = taxableAmount * 0.4;
                    break;
                case '>=60':
                    tax = taxableAmount * 0.1;
                    break;
            }
        }

        return tax;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (validateInputs()) {
            const tax = calculateTax();
            displayModal(tax);
        }
    });

    // result card pop up with result
    function displayResultCard(totalTax, remainingSalary) {
        taxResult.innerHTML = `<br> Total Payable Tax: ₹${totalTax.toFixed(2)} <br><br> Your Overall Income Will Be <br> ₹${remainingSalary.toFixed(2)} <br> after tax deduction.`;
        resultCard.style.display = 'block';
    }
 
    closeBtn.addEventListener('click', function () {
        resultCard.style.display = 'none';
        location.reload();
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (validateInputs()) {
            const tax = calculateTax();
            const grossIncome = parseFloat(document.getElementById('grossIncome').value.trim());
            const extraIncome = parseFloat(document.getElementById('extraIncome').value.trim()) || 0;
            const deductions = parseFloat(document.getElementById('deductions').value.trim()) || 0;
            const remainingSalary = grossIncome + extraIncome - tax - deductions;
            displayResultCard(tax, remainingSalary);
        }
    });

    
});
