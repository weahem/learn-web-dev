export function SiteHeader() { return (<header className="site-header">
    <div className="container header-inner">
      <div className="brand">
        <span className="wordmark">СМЕНА</span>
        <span className="brand-description">Барбершоп<br />Москва · с 2018</span>
      </div>
      <nav className="site-nav" aria-label="Основное меню">
        <ul className="site-menu">
          <li><a href="#service">Услуги</a></li>
          <li><a href="#barber">Команда</a></li>
          <li><a href="#rating">Отзывы</a></li>
          <li><a href="#contacts">Контакты</a></li>
        </ul>
      </nav>
      <a className="header-phone" href="tel:+74951234567">+7 (495) 123-45-67</a>
    </div>
  </header>); }
export function Progress() { return (<nav className="progress" aria-label="Этапы онлайн-записи">
    <ol className="container steps">
      <li className="step step--done"><span className="step-number" aria-label="Этап 1, завершён">✓</span>Мастер</li>
      <li className="step step--done"><span className="step-number" aria-label="Этап 2, завершён">✓</span>Услуга</li>
      <li className="step step--current" aria-current="step"><span className="step-number">3</span>Дата и время</li>
      <li className="step"><span className="step-number">4</span>Контакты</li>
      <li className="step"><span className="step-number">5</span>Подтверждение</li>
    </ol>
  </nav>); }
export function SiteFooter() { return (<footer className="site-footer" id="contacts">
    <div className="container">
      <div className="footer-grid">
        <div><span className="wordmark">СМЕНА</span><p>Хорошая стрижка. Свои люди.<br />Место, куда хочется вернуться.</p></div>
        <div><h2 className="footer-heading">Заходите в гости</h2><address>Москва, ул. Садовая, 15<br /><a className="footer-phone" href="tel:+74951234567">+7 (495) 123-45-67</a></address></div>
        <div><h2 className="footer-heading">Работаем для вас</h2><p>Пн–Пт: 9:00–21:00<br />Сб–Вс: 10:00–19:00</p></div>
      </div>
      <div className="footer-bottom"><small>© СМЕНА, 2026</small><span>Политика конфиденциальности</span></div>
    </div>
  </footer>); }
