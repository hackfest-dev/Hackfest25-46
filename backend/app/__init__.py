import os
from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config["UPLOAD_FOLDER"] = './uploads/'
    app.config["VIDEO_FOLDER"] = './videos/'
    app.config["UPLOADED_VIDEOS_FOLDER"] = './uploaded_videos/'
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
    os.makedirs(app.config["VIDEO_FOLDER"], exist_ok=True)
    os.makedirs(app.config["UPLOADED_VIDEOS_FOLDER"], exist_ok=True)
    
    # CORS setup
    CORS(app)
    print("[INFO] CORS enabled for all domains")

    # Register blueprints
    from app.routes.main_routes import main_bp
    from app.routes.api_routes import api_bp
    from app.routes.auth_routes import auth_bp
    from app.routes.camera_routes import camera_bp
    app.register_blueprint(main_bp, url_prefix='/main')
    app.register_blueprint(api_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(camera_bp, url_prefix='/cam')

    return app
