---
layout: page
title: Java Day 2019
permalink: /javaday/2019/
---

<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyArCETPtmpt7r3Dxb9FjN0zg1nIY-ejWyc"></script>
<script src="/js/gmaps.js" th:src="@{/js/gmaps.js}"></script>

<div class="section">
    <div class="row">
        <a href="http://www.joedayz.pe" target="_blank">
            <img src="/images/javadayperu/header.png" th:src="/images/javadayperu/header.png" alt="" width="100%" class="img-responsive"/>
        </a>
    </div>
</div>

<div class="section">
    <p><b>El 2019 se acerca y los JUGs de Latinoamérica</b> apoyados por <a href="https://twitter.com/EventosJEspanol" target="_black">@EventosJEspanol</a> presentarán 4 conferencias desde Abril hasta Julio.</p> 
    <ul class="collection">
      <li class="collection-item"><a href="http://es-conference.com‬" target="_blank">Mexico</a>, el 26 de Abril</li>
      <li class="collection-item">‪<a href="https://jconfdominicana.org‬" target="_blank">Republica Dominicana</a>, el 29 de Junio</li>
      <li class="collection-item">‪<a href="http://jconfcolombia.org‬" target="_blank">Colombia</a>, del 5 al 06 de Julio</li>
      <li class="collection-item">‪Perú‬ (Más información en Enero 2019), el 13 de Julio</li>
    </ul>
    <p><b>La Conferencia Java Day Peru 2019</b>
     busca conectar a desarrolladores y empresas interesadas en las tecnologías alrededor de Java.</p>

      <p>Contaremos con <b>Expositores de diferentes partes de América</b>
     que compartirán con nosotros los paradigmas y tecnologías que actualmente están marcando la pauta en el mercado y lo que se viene a futuro con respecto a Java y Jakarta EE.
     </p>
 
     <p> Gracias a la visita de <b>JUG Leaders</b> y 
     <b>Java Champion</b>
    de México, USA, Guatemala, Colombia y Perú, podremos tocar temas como 
    <b>Micro-servicios, Serverless, Big Data, Cloud, Java, Jakarta EE, Programación Reactiva.</b></p>  
</div>
<div class="divider"></div>
<div class="section">
    <h2 class="titlejava">EXPOSITORES</h2>

    <div class="row">
            <div class="col s12 m4 center-align">
                <img src="/images/javadayperu/markheckler.jpg" th:src="@{/images/javadayperu/markheckler.jpg}"  alt=""/><br/>
               <p> <b>MARK HECKLER</b><br/>
                Pivotal / USA</p>
            </div>
            <div class="col s12 m4 center-align">
                <img src="/images/javadayperu/eddu.jpg" th:src="@{/images/javadayperu/eddu.jpg}"  alt=""/><br/>
               <p> <b>EDDU MELENDEZ</b><br/>
                JUG Leader / Perú</p>
            </div>
            <div class="col s12 m4 center-align">
                <img src="/images/javadayperu/expo4.jpg" th:src="@{/images/javadayperu/expo4.jpg}"  alt=""/><br/>
                <p> <b>JOSE DIAZ</b><br/>
                Java Champion / JUG Leader / Perú</p>
            </div>
    </div>
</div>
<div class="section">
        <div class="row hide-on-med-and-up">
                <h2 class="titlejava">LUGAR</h2>
                <p> Pronto daremos los detalles.</p>
                <h2 class="titlejava">FECHA</h2>
                <p>
                    13 Julio de 9am. a 8pm.
                </p>
        </div>
    <div class="row">
        <div class="col s12 background-container">
            <div class="background-rotate">
                    <div class="col s12 m6"></div>
                    <div class="col s12 m6" id="map" ></div>
            </div>
            <div class="col s12 m6 hide-on-small-only address" >
                    <h2>LUGAR</h2>
                    <p> Pronto daremos los detalles.</p>
                    <h2>FECHA</h2>
                    <p>
                    13 Julio de 9am. a 8pm.
                    </p>
            </div>
               
        </div>
    </div>
</div>

<div class="section">   
    <a href="http://www.joedayz.pe" target="_blank"><img src="/images/javadayperu/footer.png" width="100%" th:src="@{/images/javadayperu/footer.png}" alt="" class="img-responsive"/></a>
</div>

<script>
    map = new GMaps({
        div: '#map',
        zoom: 18,
        lat: -12.053155,
        lng: -77.085546
    });


    map.addMarker({
        lat: -12.053155,
        lng: -77.085546,
        infoWindow: {
            content: '<p style="color:#000;">Auditorio de la FISI<br/>Univ. Nacional Mayor de San Marcos<br/></p>'
        },
        mouseover: function(e){
            this.infoWindow.open(this.map, this);
        }
    });
</script>