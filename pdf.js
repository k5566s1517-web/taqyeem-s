function printPDF() {
    const requestData = JSON.parse(localStorage.getItem('requestData')) || {
        applicantName: "عميل تجريبي",
        phoneNumber: "05xxxxxxxx",
        officialEntity: "جهة حكومية"
    };
    
    const today = new Date().toLocaleDateString('ar-SA');
    const refNo = 'REF-' + Date.now().toString().slice(-8);
    const companyName = 'شركة أسس التنمية للتقييم العقاري';

    const propertyType = document.getElementById('propertyType').value;
    const area = document.getElementById('area').value;
    const fee = document.getElementById('fee').value;
    const city = document.getElementById('city').value;
    const district = document.getElementById('district').value;

    let periodText = '-';
    const periodType = document.getElementById('periodType').value;
    if (periodType === 'لسنة الحالية') {
        periodText = 'لسنة الحالية (' + new Date().getFullYear() + ')';
    } else if (periodType === 'تقييم لسنة') {
        periodText = 'تقييم لسنة ' + (document.getElementById('singleYear').value || '');
    } else if (periodType === 'تقييم بالمثل') {
        const from = document.getElementById('fromYear').value;
        const to = document.getElementById('toYear').value;
        if (from && to) periodText = 'تقييم بالمثل من ' + from + ' إلى ' + to;
    }

    let propertyCards = `
        <div class="prop-card">
            <div class="prop-card-head">
                <span class="badge">العقار 1</span>
                <span class="prop-fee">${fee}</span>
            </div>
            <table>
                <tr><th>المدينة</th><td>${city || '-'}</td></tr>
                <tr><th>الحي</th><td>${district || '-'}</td></tr>
                <tr><th>نوع العقار</th><td>${propertyType || '-'}</td></tr>
                <tr><th>المساحة</th><td>${area || '-'} م²</td></tr>
                <tr><th>الفترة الزمنية</th><td>${periodText}</td></tr>
            </table>
        </div>
    `;

    let html = `
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <title>عقد وتقرير طلب التقييم - ${companyName}</title>
            <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
            <style>
                @page { size: A4; margin: 8mm; }
                body { font-family: 'Cairo', Tahoma, sans-serif; color: #1f3a5f; font-size: 14px; line-height: 1.7; background: #fff; margin: 0; }
                
                .sheet { border: 2px solid #1f3a5f; border-radius: 8px; padding: 25mm 8mm 7mm 8mm; margin: 0; background: #fff; page-break-after: always; position: relative; }
                .sheet:last-child { page-break-after: auto; }

                .sheet-topbar { display: flex; justify-content: space-between; border-bottom: 2px solid #c8912a; padding-bottom: 4px; margin-bottom: 7px; font-size: 11px; color: #1f3a5f; position: absolute; top: 7mm; left: 8mm; right: 8mm; }
                .sheet-topbar .brand { color: #1f3a5f; font-weight: 700; font-size: 22px; }
                .sheet-topbar .ref { color: #c8912a; font-weight: 600; font-size: 12px; }
                
                .cover { text-align: center; padding-top: 20mm; }
                .cover .logo-box { width: 90px; height: 90px; margin: 0 auto 12px; border: 3px solid #c8912a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #1f3a5f; font-size: 28px; font-weight: 700; background: #fbf7ee; }
                .cover .company { font-size: 26px; font-weight: 700; color: #1f3a5f; margin-bottom: 4px; }
                .cover .tagline { color: #c8912a; font-size: 13px; letter-spacing: 2px; margin-bottom: 20px; }
                .cover .doc-title { font-size: 22px; font-weight: 700; color: #c8912a; margin: 18px 0 5px; }
                .cover .meta { width: 72%; margin: 0 auto; text-align: right; border: 1px solid #dbe2e8; border-right: 4px solid #1f3a5f; border-radius: 6px; padding: 10px 14px; background: #fafbfc; }
                .cover .meta p { margin-bottom: 4px; font-size: 14px; color: #1f3a5f; }
                
                h1 { color: #c8912a; text-align: center; font-size: 20px; margin: 3px 0 2px; }
                .subtitle { text-align: center; color: #7a8a9a; font-size: 13px; margin-bottom: 15px; }
                h2 { color: #c8912a; font-size: 16px; border-right: 4px solid #1f3a5f; padding-right: 7px; margin: 12px 0 6px; page-break-after: avoid; }
                p { page-break-inside: avoid; margin-bottom: 6px; }
                
                table { width: 100%; border-collapse: collapse; margin-bottom: 6px; page-break-inside: avoid; }
                th, td { border: 1px solid #dbe2e8; padding: 3.5px 6px; text-align: right; font-size: 13px; color: #1f3a5f; }
                th { background: #f2f5f8; font-weight: 600; color: #1f3a5f; width: 38%; }
                
                .contract-box { border: 1px solid #dbe2e8; border-right: 4px solid #1f3a5f; border-radius: 4px; padding: 7px 9px; margin-bottom: 7px; background: #fafbfc; page-break-inside: avoid; }
                .contract-box p { margin-bottom: 3px; font-size: 14px; color: #1f3a5f; }
                
                .notice { background: #fff8e6; border-right: 4px solid #c8912a; padding: 5px 8px; font-size: 12px; color: #1f3a5f; margin-bottom: 7px; border-radius: 3px; }
                
                .props-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; direction: rtl; margin-bottom: 8px; }
                .prop-card { border: 1px solid #dbe2e8; border-radius: 6px; overflow: hidden; background: #fff; page-break-inside: avoid; }
                .prop-card-head { background: #1f3a5f; color: #fff; padding: 5px 8px; display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
                .prop-card-head .badge { background: #c8912a; color: #fff; padding: 1px 8px; border-radius: 10px; font-size: 12px; }
                .prop-card-head .prop-fee { color: #ffe6b3; font-weight: 700; }
                .prop-card table { margin: 0; }
                .prop-card th, .prop-card td { padding: 3px 6px; font-size: 12px; border: 0; border-bottom: 1px solid #eef2f6; color: #1f3a5f; }
                .prop-card th { background: #f8fafc; width: 42%; }
                
                .sig { display: flex; justify-content: space-between; margin-top: 30px; page-break-inside: avoid; }
                .sig div { width: 44%; text-align: center; }
                .sig-line { border-top: 1px solid #1f3a5f; margin-top: 35px; padding-top: 4px; font-size: 13px; color: #1f3a5f; }
            </style>
        </head>
        <body>

            <!-- ===== الصفحة 1: الغلاف ===== -->
            <div class="sheet">
                <div class="sheet-topbar">
                    <span class="brand">${companyName}</span>
                    <span class="ref">${refNo} | ${today}</span>
                </div>
                <div class="cover">
                    <div class="logo-box">أسس</div>
                    <div class="company">${companyName}</div>
                    <div class="tagline">خدمات تقييم عقاري معتمدة</div>
                    <div class="doc-title">عقد تقديم خدمات تقييم عقاري</div>
                    <div class="meta">
                        <p><strong>الرقم المرجعي:</strong> ${refNo}</p>
                        <p><strong>التاريخ:</strong> ${today}</p>
                        <p><strong>اسم العميل:</strong> ${requestData.applicantName}</p>
                        <p><strong>رقم الجوال:</strong> ${requestData.phoneNumber}</p>
                        <p><strong>الجهة الرسمية:</strong> ${requestData.officialEntity}</p>
                    </div>
                </div>
            </div>

            <!-- ===== الصفحة 2: بنود العقد (الجزء الأول) ===== -->
            <div class="sheet">
                <div class="sheet-topbar">
                    <span class="brand">${companyName}</span>
                    <span class="ref">${refNo} | ${today}</span>
                </div>
                <h1>عقد تقديم خدمات تقييم عقاري</h1>
                <div class="subtitle">أطراف العقد والبنود التعاقدية (الصفحة 1 من 3)</div>

                <div class="notice">هذا النموذج مبدئي ويجب مراجعته من المستشار القانوني للشركة قبل الاستخدام الرسمي.</div>

                <h2>أطراف العقد</h2>
                <div class="contract-box">
                    <p><strong>الطرف الأول (مقدم الخدمة):</strong> ${companyName}</p>
                    <p><strong>الطرف الثاني (العميل):</strong> ${requestData.applicantName} — جوال: ${requestData.phoneNumber}</p>
                    <p><strong>الجهة الرسمية / المستفيد:</strong> ${requestData.officialEntity}</p>
                    <p><strong>تاريخ العقد:</strong> ${today}</p>
                </div>

                <h2>البند الأول: التمهيد ونطاق العمل</h2>
                <p>يعتبر التمهيد السابق جزءاً لا يتجزأ من هذا العقد. يلتزم الطرف الأول (شركة التقييم) بتقديم خدمات التقييم العقاري للعقارات الموصوفة في هذا العقد، وفقاً للغرض ونوع الطلب والفترة الزمنية المحددة. يقر الطرف الثاني بأنه على علم تام بطبيعة الخدمة المطلوبة، وبأن التقييم سيتم بناءً على المعلومات المتاحة في تاريخ المعاينة.</p>

                <h2>البند الثاني: الأتعاب وطريقة السداد</h2>
                <p>اتفق الطرفان على أن الأتعاب الإجمالية للخدمات المقدمة هي المبلغ الموضح في التقرير المرفق. وتشمل هذه الأتعاب كافة المصاريف الإدارية، وأجور الفريق، وتكاليف الانتقال. تُسدد الأتعاب وفقاً للجدول الزمني المتفق عليه، ولا يحق للطرف الثاني حجب أي مبلغ أو خصمه دون سبب نظامي موثق يثبت تقصير الطرف الأول.</p>

                <h2>البند الثالث: عدم استرداد الأتعاب وعدم الاعتراض على التقييم</h2>
                <p>1. يوافق الطرف الثاني (العميل) صراحةً على أن الأتعاب المتفق عليها غير قابلة للاسترداد مطلقاً بعد بدء الطرف الأول في تنفيذ الخدمة.<br>
                2. يقر الطرف الثاني بأن التقييم العقاري هو <strong>رأي مهني فني</strong> يعتمد على المعلومات المتاحة وظروف السوق في تاريخ التقييم، ولا يُعد ضماناً لقيمة العقار. لذلك، <strong>لا يحق للطرف الثاني الاعتراض على نتيجة التقييم</strong> أو المطالبة باسترداد الرسوم بحجة عدم توافقها مع توقعاته الشخصية.<br>
                3. في حال إلغاء الطلب بعد بدء التنفيذ، يحق للطرف الأول الاحتفاظ بكامل الأتعاب، دون الإخلال بأي حق آخر له بموجب الأنظمة.</p>
            </div>

            <!-- ===== الصفحة 3: بنود العقد (الجزء الثاني) ===== -->
            <div class="sheet">
                <div class="sheet-topbar">
                    <span class="brand">${companyName}</span>
                    <span class="ref">${refNo} | ${today}</span>
                </div>
                <h1>عقد تقديم خدمات تقييم عقاري</h1>
                <div class="subtitle">البنود التعاقدية (الصفحة 2 من 3)</div>

                <h2>البند الرابع: التزامات الطرف الثاني (العميل)</h2>
                <p>1. تقديم جميع المستندات الصحيحة والكاملة المتعلقة بالعقارات.<br>
                2. تسهيل دخول المقيّم إلى العقار لإجراء المعاينة الميدانية في المواعيد المتفق عليها.<br>
                3. إخطار الطرف الأول فوراً بأي تغييرات تطرأ على العقار.<br>
                4. يتحمل الطرف الثاني المسؤولية الكاملة عن أي مستندات مزورة، ويحق للطرف الأول إلغاء التقرير دون رد الأتعاب.</p>

                <h2>البند الخامس: التزامات الطرف الأول (المقيّم)</h2>
                <p>1. إجراء المعاينة الميدانية الدقيقة للعقار وتوثيق حالته.<br>
                2. إعداد تقرير تقييم فني يتوافق مع المعايير الدولية والمحلية.<br>
                3. تسليم التقرير في المدة المتفق عليها بعد استكمال المستندات.<br>
                4. الالتزام بالاستقلالية والحيادية التامة.</p>

                <h2>البند السادس: السرية وحماية البيانات</h2>
                <p>يلتزم الطرف الأول بالحفاظ على سرية جميع بيانات الطرف الثاني، ولا يحق له الإفصاح عنها لأي طرف ثالث دون إذن كتابي مسبق، باستثناء ما يقتضيه القانون.</p>

                <h2>البند السابع: حدود المسؤولية والإقرارات</h2>
                <p>لا يتحمل الطرف الأول مسؤولية أي خسائر مباشرة أو غير مباشرة تنتج عن استخدام التقرير في أغراض لم تُذكر عند طلبه. التقرير لا يُعد ضماناً لأي معاملة مالية.</p>

                <h2>البند الثامن: إخلاء المسؤولية وتبرئة الذمة</h2>
                <p>يقر الطرف الثاني بأنه لن يطالب الطرف الأول بأي تعويضات نتيجة استخدام التقرير. كما يقر بأنه لا يحق له مقاضاة الطرف الأول بسبب اعتراضه على القيمة التقديرية، طالما أن المقيّم اتبع المعايير المهنية المعتمدة من الهيئة السعودية للمقيمين المعتمدين.</p>
            </div>

            <!-- ===== الصفحة 4: بنود العقد (الجزء الثالث) ===== -->
            <div class="sheet">
                <div class="sheet-topbar">
                    <span class="brand">${companyName}</span>
                    <span class="ref">${refNo} | ${today}</span>
                </div>
                <h1>عقد تقديم خدمات تقييم عقاري</h1>
                <div class="subtitle">البنود التعاقدية (الصفحة 3 من 3)</div>

                <h2>البند التاسع: القوة القاهرة</h2>
                <p>لا يتحمل أي من الطرفين مسؤولية التأخير الناتج عن ظروف قاهرة خارجة عن إرادته (كالكوارث الطبيعية أو القرارات الحكومية).</p>

                <h2>البند العاشر: إشعارات التبليغ</h2>
                <p>تكون جميع الإشعارات كتابية وتُرسل عبر أرقام الجوال أو البريد الإلكتروني المسجل. يُعد الإشعار مستلماً في اليوم التالي لإرساله.</p>

                <h2>البند الحادي عشر: حقوق الملكية الفكرية</h2>
                <p>يحتفظ الطرف الأول بحقوق الملكية الفكرية لمنهجية التقييم. يُمنح الطرف الثاني حق استخدام التقرير للأغراض المحددة فقط.</p>

                <h2>البند الثاني عشر: التنازل</h2>
                <p>لا يحق لأي من الطرفين التنازل عن أي من حقوقه أو التزاماته بموجب هذا العقد لأي طرف ثالث دون الحصول على موافقة كتابية مسبقة من الطرف الآخر.</p>

                <h2>البند الثالث عشر: التعديلات</h2>
                <p>لا يُعتد بأي تعديل أو إضافة أو ملحق لهذا العقد ما لم يكن مكتوباً وموقّعاً من كلا الطرفين.</p>

                <h2>البند الرابع عشر: إنهاء العقد</h2>
                <p>يحق لأي من الطرفين إنهاء هذا العقد في حال إخلال الطرف الآخر بأي من التزاماته الجوهرية، وذلك بعد إرسال إشعار كتابي وتوفير فترة 15 يوماً لتصحيح الإخلال.</p>

                <h2>البند الخامس عشر: التعويضات</h2>
                <p>في حال إخلال الطرف الثاني بأي من التزاماته، يلتزم بتعويض الطرف الأول عن كافة الأضرار والخسائر المباشرة الناتجة عن هذا الإخلال.</p>

                <h2>البند السادس عشر: حجية التوقيع الإلكتروني</h2>
                <p>يقر الطرفان بأن التوقيع الإلكتروني أو الموافقة الإلكترونية على هذا العقد لهما نفس الحجية القانونية للتوقيع التقليدي.</p>

               
            </div>

            <!-- ===== الصفحة 5: وصف العقارات ===== -->
            <div class="sheet">
                <div class="sheet-topbar">
                    <span class="brand">${companyName}</span>
                    <span class="ref">${refNo} | ${today}</span>
                </div>
                <h1>وصف العقارات محل التقييم</h1>
                <div class="subtitle">بيانات العقارات المطلوب تقييمها والأتعاب التقديرية</div>
                <div class="props-grid">
                    ${propertyCards}
                </div>
            </div>

            <!-- ===== الصفحة 6: التوقيعات والاعتماد ===== -->
            <div class="sheet">
                <div class="sheet-topbar">
                    <span class="brand">${companyName}</span>
                    <span class="ref">${refNo} | ${today}</span>
                </div>
                <h1>التوقيعات والاعتماد</h1>
                <div class="subtitle">إقرار الطرفين بالاطلاع والموافقة على بنود العقد وبيانات العقارات والأتعاب</div>

                <div class="contract-box" style="margin-top: 20px;">
                    <p>أقر أنا الطرف الثاني (العميل) بأنني اطلعت على جميع بنود هذا العقد، بما فيها نطاق العمل، والأتعاب، وسياسة عدم الاسترداد، وعدم الاعتراض على التقييم، والتزاماتي كعميل. ووافقت عليها بكامل إرادتي ودون أي إكراه. كما أقر بصحة جميع البيانات والمستندات التي قدمتها.</p>
                </div>

                <div class="sig">
                    <div>
                        <p><strong>الطرف الأول (مقدم الخدمة)</strong></p>
                        <p style="font-size:14px; color:#5a6b7b;">${companyName}</p>
                        <div class="sig-line">التوقيع / الختم</div>
                    </div>
                    <div>
                        <p><strong>الطرف الثاني (العميل)</strong></p>
                        <p style="font-size:14px; color:#5a6b7b;">${requestData.applicantName}</p>
                        <div class="sig-line">التوقيع</div>
                    </div>
                </div>

                <div style="margin-top: 25px; text-align: center; color: #a0aab5; font-size: 12px;">
                    (مكان الختم الرسمي للشركة)
                </div>
            </div>

        </body>
        </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 600);
}