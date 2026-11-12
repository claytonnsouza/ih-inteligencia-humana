(function () {
  'use strict';

  /* ============================================================
     CONFIGURAÇÃO — troque pelo WhatsApp real da IH
     Formato: 55 + DDD + número, só dígitos. Ex.: 5511999998888
     ============================================================ */
  var WHATSAPP_NUMERO = '55XXXXXXXXXXX';
  var MSG_ATALHO = 'Oi! Quero a aula experimental de 40 minutos no meu bairro';

  var numeroConfigurado = /^\d{12,13}$/.test(WHATSAPP_NUMERO);

  /* Atalho "Chamar no WhatsApp": o número vem só deste arquivo */
  var atalho = document.getElementById('wa-atalho');
  if (atalho) {
    atalho.href = 'https://wa.me/' + WHATSAPP_NUMERO + '?text=' + encodeURIComponent(MSG_ATALHO);
  }

  /* Scroll reveal (fade + slide-up) */
  var reveals = document.querySelectorAll('.reveal');
  var reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduzMovimento && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* Formulário curto: nome + WhatsApp + LGPD */
  var form = document.getElementById('lead-form');
  if (!form) return;

  var nomeInput = document.getElementById('nome-responsavel');
  var telInput = document.getElementById('whatsapp-responsavel');
  var lgpdInput = document.getElementById('aceite-lgpd');
  var erroNome = document.getElementById('erro-nome');
  var erroTel = document.getElementById('erro-whatsapp');
  var erroLgpd = document.getElementById('erro-lgpd');
  var feedback = document.getElementById('form-feedback');

  telInput.addEventListener('input', function (e) {
    var v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) {
      e.target.value = v.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '$1 $2-$3');
    } else if (v.length > 2) {
      e.target.value = v.replace(/^(\d{2})(\d{0,5})/, '$1 $2');
    } else {
      e.target.value = v;
    }
  });

  function marcarErro(campo, msg, temErro) {
    if (temErro) {
      campo.setAttribute('aria-invalid', 'true');
      msg.classList.add('visible');
    } else {
      campo.removeAttribute('aria-invalid');
      msg.classList.remove('visible');
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var nome = nomeInput.value.trim();
    var digitos = telInput.value.replace(/\D/g, '');
    var nomeInvalido = nome.length < 2;
    var telInvalido = digitos.length < 10 || digitos.length > 11;
    var lgpdInvalido = !lgpdInput.checked;

    marcarErro(nomeInput, erroNome, nomeInvalido);
    marcarErro(telInput, erroTel, telInvalido);
    marcarErro(lgpdInput, erroLgpd, lgpdInvalido);

    if (nomeInvalido) { nomeInput.focus(); return; }
    if (telInvalido) { telInput.focus(); return; }
    if (lgpdInvalido) { lgpdInput.focus(); return; }

    var texto = 'Oi! Sou ' + nome + ' (WhatsApp ' + telInput.value + ') e quero agendar a aula experimental de 40 minutos no meu bairro.';

    if (!numeroConfigurado) {
      feedback.textContent = 'Modo de teste: formulário validado. Para abrir o WhatsApp, defina WHATSAPP_NUMERO em js/main.js.';
      feedback.className = 'form-feedback success';
      return;
    }

    feedback.textContent = 'Pronto, ' + nome + '! Abrindo o WhatsApp para confirmar o horário da aula experimental no seu bairro.';
    feedback.className = 'form-feedback success';
    window.open('https://wa.me/' + WHATSAPP_NUMERO + '?text=' + encodeURIComponent(texto), '_blank', 'noopener,noreferrer');
  });
})();
