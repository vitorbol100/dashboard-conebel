/* ============================================================
   FILE READER — upload e drag & drop da planilha
   ============================================================ */
Conebel.fileReader = (function () {

  function setStatus(status, text) {
    const badge = document.getElementById('uploadStatusBadge');
    if (!badge) return;
    badge.className = 'upload-status-badge ' + status;
    badge.textContent = text;
  }

  function handleFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();

    if (!['xlsx', 'xls', 'csv'].includes(ext)) {
      setStatus('error', 'Formato inválido');
      Conebel.toast.show('Por favor envie apenas arquivos .xlsx, .xls ou .csv', { type: 'error' });
      return;
    }

    setStatus('loading', 'Lendo planilha...');
    document.getElementById('loadedFileName').textContent = file.name;
    document.getElementById('uploadSubText').textContent = 'Carregando dados da planilha...';

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = e => {
      try {
        if (typeof XLSX === 'undefined') throw new Error('Biblioteca XLSX não carregada');

        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: true });

        Conebel.sheetParser.parse(rows, file.name);

        setStatus('success', 'Dados carregados');
        document.getElementById('uploadSubText').textContent =
          'Última atualização: ' + Conebel.state.lastFile.date;
        document.getElementById('btnSelectFileLabel').textContent = 'Trocar arquivo';

        Conebel.toast.show(`Planilha "${file.name}" lida com sucesso!`, { type: 'success' });
      } catch (err) {
        console.error(err);
        setStatus('error', 'Erro ao ler o arquivo');
        Conebel.toast.show('Erro ao processar a planilha. Verifique a formatação.', { type: 'error' });
      }
    };

    reader.onerror = () => setStatus('error', 'Erro na leitura');
  }

  function restoreLastFile() {
    const last = Conebel.state.lastFile;
    if (!last) return;

    document.getElementById('loadedFileName').textContent = last.name;
    setStatus('success', 'Dados carregados');
    document.getElementById('uploadSubText').textContent = 'Última atualização: ' + last.date;
    document.getElementById('btnSelectFileLabel').textContent = 'Trocar arquivo';
  }

  function init() {
    const input = document.getElementById('fileInput');
    const btn = document.getElementById('btnSelectFile');
    const zone = document.getElementById('dropZone');

    btn.addEventListener('click', () => input.click());

    input.addEventListener('change', () => {
      if (input.files[0]) handleFile(input.files[0]);
    });

    zone.addEventListener('dragover', e => {
      e.preventDefault();
      zone.classList.add('dragover');
    });

    zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));

    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('dragover');
      if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    });
  }

  return { init, handleFile, setStatus, restoreLastFile };
})();