document.querySelectorAll(".segmented").forEach(group => {
  const hidden = group.parentElement.querySelector('input[type="hidden"]');

  group.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      group.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      button.classList.add("active");

      if (hidden) {
        hidden.value = button.dataset.value || button.textContent.trim();
      }
    });
  });
});

const form = document.getElementById("quoteForm");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  if (!data.get("car") || !data.get("name") || !data.get("phone")) {
    alert("?щ쭩 李⑤웾, 怨좉컼紐? ?대??곕쾲?몃? ?낅젰?댁＜?몄슂.");
    return;
  }

  if (!data.get("privacy_agree")) {
    alert("媛쒖씤?뺣낫 ?섏쭛 諛??댁슜 ?숈쓽媛 ?꾩슂?⑸땲??");
    return;
  }

  const submitButton = form.querySelector('[type="submit"]');
  const originalText = submitButton?.textContent;

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "?묒닔 以?..";
  }

  const isCarPage = window.location.pathname.includes("/cars/");

  const regionMap = {
    seoul: "서울",
    busan: "부산",
    daegu: "대구",
    incheon: "인천",
    gwangju: "광주",
    daejeon: "대전",
    ulsan: "울산",
    sejong: "세종",
    gyeonggi: "경기",
    gangwon: "강원",
    chungbuk: "충북",
    chungnam: "충남",
    jeonbuk: "전북",
    jeonnam: "전남",
    gyeongbuk: "경북",
    gyeongnam: "경남",
    jeju: "제주"
  };

  const firstPathSegment = window.location.pathname.split("/").filter(Boolean)[0] || "";
  const region = isCarPage ? "" : (regionMap[firstPathSegment] || "");

  const payload = {
    name: data.get("name"),
    phone: data.get("phone"),
    car: data.get("car"),
    consultation_type: data.get("type") || "",
    months: data.get("months") || "",
    region,
    page_url: window.location.href,
    privacy_agreed: true
  };

  try {
    const response = await fetch(
      "/.netlify/functions/submit-consultation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const result = await response.json();

    if (!response.ok || !result.ok) {
      throw new Error(result.message || "상담 접수에 실패했습니다.");
    }

    alert("상담 신청이 정상적으로 접수되었습니다.");

    form.querySelector('[name="name"]').value = "";
    form.querySelector('[name="phone"]').value = "";

    const privacy = form.querySelector('[name="privacy_agree"]');
    if (privacy) privacy.checked = true;

  } catch (error) {
    alert(error.message || "상담 접수 중 오류가 발생했습니다.");
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  }
});

document.getElementById("callPlaceholder")?.addEventListener("click", () => {
  window.location.href = "tel:010-2144-2950";
});




