<script>
  import '../layout.css';
  if (typeof window !== 'undefined') {
    window.onerror = function(msg, source, line, col, err) {
      document.body.innerHTML = '<pre style="color:white;padding:20px;font-size:14px">' + msg + '\n' + source + ':' + line + ':' + col + '</pre>'
    }
  }


</script>

<div class="bg-bg-primary w-screen h-screen">
  <slot />
</div>