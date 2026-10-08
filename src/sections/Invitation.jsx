import SceneBackground from "../components/SceneBackground.jsx";
import { useState } from "react";
import { wedding } from "../data/wedding.js";
import {
  Ornament,
  Divider,
  MedievalFrame,
  MedievalButton,
  Section,
} from "../components/Decorations.jsx";
import ImageFrame from "../components/ImageFrame.jsx";
import Countdown from "../components/Countdown.jsx";
import { RadioGroup, CheckboxGroup } from "../components/Choices.jsx";
import { downloadCalendar } from "../utils/calendar.js";
import { submitRsvp } from "../services/rsvp.js";
const initialRsvp = {
  attendance: "yes",
  guestName: "",
  overnight: "",
  transfer: "",
  food: "",
  drinks: [],
  customDrink: "",
};
function Illustration({ name, alt, className = "" }) {
  return (
    <img
      className={`vignette ${className}`}
      src={`/assets/${name}.svg`}
      alt={alt}
      loading="lazy"
      width="800"
      height="500"
    />
  );
}
export default function Invitation() {
  const [rsvp, setRsvp] = useState(initialRsvp);
  const [saved, setSaved] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [mapMessage, setMapMessage] = useState(false);
  const [calendarMessage, setCalendarMessage] = useState(false);
  const [error, setError] = useState("");
  const change = (key, value) => {
    setRsvp((previous) => ({ ...previous, [key]: value }));
    setSaved(null);
    setError("");
  };
  async function submit(event) {
    event.preventDefault();
    if (!rsvp.guestName.trim()) {
      setError("Пожалуйста, укажите ваше имя и фамилию.");
      document.querySelector("#guest-name")?.focus();
      return;
    }
    if (
      rsvp.attendance === "yes" &&
      rsvp.drinks.includes("Другое") &&
      !rsvp.customDrink.trim()
    ) {
      setError("Укажите название вашего напитка.");
      document.querySelector("#custom-drink")?.focus();
      return;
    }
    if (
      rsvp.attendance === "yes" &&
      (!rsvp.overnight || !rsvp.transfer || !rsvp.food || !rsvp.drinks.length)
    ) {
      setError("Выберите ночёвку, трансфер, блюдо и хотя бы один напиток.");
      const first = !rsvp.overnight
        ? "overnight"
        : !rsvp.transfer
          ? "transfer"
          : !rsvp.food
            ? "food"
            : "drinks";
      document.querySelector(`#${first} input`)?.focus();
      return;
    }
    setSubmitting(true);
    try {
      setSaved(await submitRsvp(rsvp));
    } catch {
      setError("Не удалось сохранить ответ локально. Попробуйте ещё раз.");
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <>
      <header className="site-header">
        <a
          href="#hero"
          className="monogram"
          aria-label="Валерий и Юлия, к началу"
        >
          В <span>&</span> Ю
        </a>
        <span className="header-date">22 · 06 · 2028</span>
        <a href="#final" className="header-rsvp">
          Ответить на приглашение <span aria-hidden="true">↗</span>
        </a>
      </header>
      <main id="invitation" tabIndex="-1">
        <section
          id="hero"
          data-section="1"
          className="hero"
          aria-labelledby="hero-title"
        >
          <SceneBackground scene="night" />
          <div className="hero-side left" aria-hidden="true">
            ANNO DOMINI · MMXXVIII
          </div>
          <div className="hero-side right" aria-hidden="true">
            ДВЕ ДУШИ · ОДНА ИСТОРИЯ
          </div>
          <MedievalFrame className="hero-frame">
            <Ornament type="crown" />
            <p className="eyebrow">Приглашение</p>
            <p className="hero-subtitle">на свадебный пир</p>
            <h1 id="hero-title">
              Валерий <span className="hero-and">и</span> Юлия
            </h1>
            <Divider />
            <p className="hero-date">{wedding.dateLabel}</p>
            <p className="hero-place">FEW HORSES · ПОДМОСКОВЬЕ</p>
            <div className="seal" aria-label="Печать Валерия и Юлии">
              <span>В</span>
              <small>&</small>
              <span>Ю</span>
            </div>
            <a href="#greeting" className="scroll-link">
              Листайте вниз <span aria-hidden="true">↓</span>
            </a>
          </MedievalFrame>
          <div className="hero-botanical botanical-left" aria-hidden="true">
            ❧
          </div>
          <div className="hero-botanical botanical-right" aria-hidden="true">
            ❧
          </div>
        </section>
        <Section
          number="II"
          id="greeting"
          title="Любимые друзья!"
          className="greeting"
        >
          <Ornament />
          <p className="lead dropcap">
            Наконец-то это свершилось,
            <br /> мы женимся :)
          </p>
          <p>И хотим разделить этот день с вами!</p>
          <p className="handwritten">Начнём новую главу вместе.</p>
          <Divider />
        </Section>
        <Section
          number="III"
          id="countdown"
          title="До свадебного пира осталось:"
          className="dark countdown-section"
        >
          <Ornament type="crown" />
          <Countdown />
          <p className="small-copy">
            До дня, который станет нашей общей историей
          </p>
        </Section>
        <Section
          number="IV"
          id="venue"
          title="Там, где оживает сказка"
          className="venue"
        >
          <div className="venue-layout">
            <ImageFrame
              imageKey="venue"
              alt="Иллюстрированное старинное поместье Few Horses"
            />
            <div className="venue-copy">
              <p className="date-ribbon">{wedding.dateLabel}</p>
              <h3>Few Horses</h3>
              <p>
                Место, где всё начнётся — Few Horses, старинное английское
                поместье.
              </p>
              <p>{wedding.address}.</p>
              <p className="meeting-time">
                Сбор гостей — <strong>{wedding.timeLabel}.</strong>
              </p>
              <MedievalButton
                type="button"
                onClick={() =>
                  wedding.mapUrl
                    ? window.open(
                        wedding.mapUrl,
                        "_blank",
                        "noopener,noreferrer",
                      )
                    : setMapMessage(!mapMessage)
                }
              >
                Показать на карте
              </MedievalButton>
              {mapMessage && (
                <p className="local-note" role="status">
                  Ссылка на карту появится здесь, когда мы уточним маршрут.
                </p>
              )}
            </div>
          </div>
        </Section>
        <Section
          number="V"
          id="calendar"
          title="Сохраните этот день"
          className="calendar-section"
        >
          <div className="calendar-date" aria-hidden="true">
            <span>ИЮНЬ</span>
            <strong>22</strong>
            <span>ЧЕТВЕРГ · 2028</span>
          </div>
          <div>
            <p>
              Пусть среди повседневных дел
              <br />
              найдётся место для маленькой сказки.
            </p>
            <MedievalButton
              type="button"
              onClick={() => {
                downloadCalendar();
                setCalendarMessage(true);
              }}
            >
              Добавить в календарь
            </MedievalButton>
            <p className="small-copy">22 июня · 13:00 · московское время</p>
            {calendarMessage && (
              <p className="local-note" role="status">
                Файл календаря готов. Откройте его в своём календаре.
              </p>
            )}
          </div>
        </Section>
        <Section
          number="VI"
          id="dress"
          title="Облачитесь в историю"
          className="dress"
        >
          <p className="lead">
            Наше мероприятие пройдёт в стиле средневековья.
          </p>
          <div className="dress-text">
            <p>
              Мы не требуем от вас доспехов и мечей (хотя, если очень хочется —
              почему нет). Достаточно земляных оттенков, накидок, льняных рубах
              и длинных платьев.
            </p>
            <p>
              Главное — чтобы вам было удобно пировать, стрелять из лука и
              танцевать у костра. Поэтому обувь выбирайте удобную — каблуки,
              конечно, прекрасны, но к концу вечера вы нас тихо возненавидите, а
              мы этого не хотим :)
            </p>
          </div>
          <div
            className="palette"
            aria-label="Палитра: лесной зелёный, оливковый, бордовый, коричневый, песочный, кремовый"
          >
            {[
              "#454f3b",
              "#858366",
              "#693c38",
              "#7b6049",
              "#b9a079",
              "#e5d8b8",
            ].map((color) => (
              <span key={color} style={{ backgroundColor: color }} />
            ))}
          </div>
          <div className="dress-gallery">
            <div>
              <ImageFrame
                imageKey="men"
                alt="Пример мужского образа: льняная рубаха и земляные оттенки"
              />
              <h3>Пример для него</h3>
            </div>
            <div>
              <ImageFrame
                imageKey="women"
                alt="Пример женского образа: длинное платье лесного оттенка"
              />
              <h3>Пример для неё</h3>
            </div>
          </div>
          <p className="studio-note">
            Если хочется что-то подобрать — можно заглянуть в{" "}
            <strong>Studio68</strong> (Москва).
          </p>
        </Section>
        <Section
          number="VII"
          id="gifts"
          title="Самое дорогое — вы"
          className="gifts burgundy"
        >
          <div className="illustrated-layout">
            <Illustration
              name="treasure-chest"
              alt="Старинный сундук с золотыми монетами"
            />
            <div>
              <p className="lead">
                Мы будем счастливы видеть вас — и это главное.
              </p>
              <p>
                Если захотите порадовать нас чем-то ещё: цветочки, пожалуйста,
                не нужно — мы их просто не довезём. А вот вклад в наше
                путешествие станет самым тёплым и нужным подарком.
              </p>
              <p className="handwritten">
                И да — «Горько» можно!
                <br />
                Никаких запретов у нас нет :)
              </p>
            </div>
          </div>
        </Section>
        <form id="rsvp-form" onSubmit={submit}>
          <Section
            number="VIII"
            id="overnight"
            title="Останьтесь в нашей сказке"
            className="overnight"
          >
            <div className="illustrated-layout reverse">
              <Illustration
                name="castle-bedroom"
                alt="Средневековая спальня с кроватью под балдахином"
              />
              <div>
                <p>
                  Чтобы всем было весело и не пришлось выбирать между вином и
                  рулём — у нас есть возможность оставить вас с нами на вилле.
                  Места хватит.
                </p>
                <RadioGroup
                  legend="Планируете ли вы остаться на ночь?"
                  name="overnight"
                  value={rsvp.overnight}
                  options={[
                    "Да, остаюсь (захватите пижаму!)",
                    "Нет, уеду вечером",
                  ]}
                  onChange={(value) => change("overnight", value)}
                />
              </div>
            </div>
          </Section>
          <Section
            number="IX"
            id="transfer"
            title="Карета подана"
            className="transfer"
          >
            <div className="illustrated-layout">
              <Illustration name="carriage" alt="Лошадь со старинной каретой" />
              <div>
                <p className="small-copy">Путь к нашему празднику</p>
                <RadioGroup
                  legend="Нужен ли трансфер?"
                  name="transfer"
                  value={rsvp.transfer}
                  options={[
                    "Только туда",
                    "Только обратно",
                    "Туда-обратно",
                    "Не нужен",
                  ]}
                  onChange={(value) => change("transfer", value)}
                />
              </div>
            </div>
          </Section>
          <Section
            number="X"
            id="children"
            title="Вечер для больших рыцарей"
            className="children"
          >
            <Illustration
              name="sword-shield"
              alt="Игрушечные деревянные меч и щит"
            />
            <div>
              <p>
                Мы очень любим ваших детей, но этот вечер решили сделать
                взрослым — чтобы никто никуда не спешил и не скучал.
              </p>
              <Ornament />
            </div>
          </Section>
          <Section
            number="XI"
            id="food"
            title="К королевскому столу"
            className="food dark"
          >
            <p className="small-copy">Пир, достойный нашей истории</p>
            <Illustration
              name="medieval-feast"
              alt="Средневековый пир: мясо, рыба, овощи, сыр, хлеб и фрукты на деревянном столе"
            />
            <RadioGroup
              legend="Что вы предпочитаете?"
              name="food"
              value={rsvp.food}
              options={["Мясо", "Рыба", "Овощи", "Всё"]}
              onChange={(value) => change("food", value)}
            />
          </Section>
          <Section
            number="XII"
            id="drinks"
            title="Поднимем кубки"
            className="drinks"
          >
            <div className="illustrated-layout reverse">
              <Illustration
                name="barrel"
                alt="Деревянная бочка с краном и чугунные кружки"
              />
              <div>
                <CheckboxGroup
                  legend="Что вам налить?"
                  value={rsvp.drinks}
                  options={[
                    "Сидр",
                    "Эль",
                    "Белое вино",
                    "Красное вино",
                    "Шампанское",
                    "Водка",
                    "Другое",
                    "Не пью (пу-пу-пууу)",
                  ]}
                  onChange={(value) => {
                    change("drinks", value);
                    if (!value.includes("Другое")) change("customDrink", "");
                  }}
                />
                <p className="choice-hint">Можно выбрать несколько вариантов</p>
                {rsvp.drinks.includes("Другое") && (
                  <div className="text-field">
                    <label htmlFor="custom-drink">Ваш любимый напиток</label>
                    <input
                      id="custom-drink"
                      name="customDrink"
                      value={rsvp.customDrink}
                      onChange={(e) => change("customDrink", e.target.value)}
                      maxLength={150}
                      required={rsvp.attendance === "yes"}
                      placeholder="Расскажите, что вам по душе"
                    />
                  </div>
                )}
              </div>
            </div>
          </Section>
          <Section
            number="XIII"
            id="final"
            title="Впишем вас в нашу историю?"
            className="final"
          >
            <Ornament type="crown" />
            <p className="lead">
              Ждём вас. Свадебный пир начнётся
              <br />
              {wedding.dateLabel}.
            </p>
            <MedievalFrame className="rsvp-frame">
              <p className="eyebrow">Ваш ответ на приглашение</p>
              <div className="text-field">
                <label htmlFor="guest-name">Ваше имя и фамилия</label>
                <input
                  id="guest-name"
                  name="guestName"
                  autoComplete="name"
                  value={rsvp.guestName}
                  onChange={(e) => change("guestName", e.target.value)}
                  placeholder="Как записать вас в хронику?"
                  required
                  maxLength={100}
                />
              </div>
              <RadioGroup
                legend="Сможете разделить этот день с нами?"
                name="attendance"
                value={
                  rsvp.attendance === "yes"
                    ? "С радостью буду!"
                    : "К сожалению, не смогу"
                }
                options={["yes", "no"].map((v) =>
                  v === "yes" ? "С радостью буду!" : "К сожалению, не смогу",
                )}
                onChange={(value) =>
                  change(
                    "attendance",
                    value === "С радостью буду!" ? "yes" : "no",
                  )
                }
              />
              {/* Map display labels to domain state without coupling service to copy. */}
              <MedievalButton type="submit" disabled={submitting}>
                {submitting ? "Сохраняем…" : "Подтвердить присутствие"}
              </MedievalButton>
              <p className="local-note">
                Прототип: ответ сохраняется только в памяти этой страницы и не
                отправляется организаторам.
              </p>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              {saved && (
                <div className="rsvp-success" role="status">
                  <Ornament />
                  <h3>
                    {saved.attendance === "yes"
                      ? "Вы вписаны в нашу хронику!"
                      : "Спасибо за ваш ответ!"}
                  </h3>
                  <p>
                    {saved.guestName}, ваш ответ сохранён локально.{" "}
                    {saved.attendance === "yes"
                      ? "С нетерпением ждём встречи."
                      : "Будем мысленно рядом."}
                  </p>
                  <p className="small-copy">
                    После обновления страницы ответ исчезнет.
                  </p>
                </div>
              )}
            </MedievalFrame>
            <ImageFrame
              imageKey="couple"
              className="couple-image"
              alt="Иллюстрация Валерия и Юлии в средневековых образах"
            />
            <p className="signature">Ваши Валерий и Юлия</p>
            <p className="farewell">До скорой встречи!</p>
            <Divider />
          </Section>
        </form>
      </main>
      <footer className="site-footer">
        <span>В & Ю</span>
        <p>XXII · VI · MMXXVIII</p>
        <small>У каждой любви есть своя сказка.</small>
        <a href="#hero">Вернуться к началу ↑</a>
      </footer>
    </>
  );
}
