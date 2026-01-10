<template>
  <header class=" shadow-sm">
    <nav class="navbar navbar-expand-lg container">
      <a class="navbar-brand fw-bold logo" href="/home">SnackUp</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><a class="nav-link" href="#">Accueil</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Menu</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Contact</a></li>
          <li class="nav-item"><a class="nav-link btn btn-sm" href="/login">Sign Up</a></li>
          <li class="nav-item"><a class="nav-link btn  btn-sm" href="/Rgister">Sgin In</a></li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<style scoped>
header {
  width: 100%;
}
.logo{
    color:#ff6f61
}
</style>
